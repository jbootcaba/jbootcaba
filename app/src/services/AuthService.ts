import { Request } from "express";
import { Configuration } from "../configs/Configuration";
import { isAfter, addMinutes, parseISO } from "date-fns";
import { IUser } from "../IUser";
import { config, container, provideSingleton } from "jbootcaba";
import { injectable, interfaces } from "inversify";
import jwt from "jsonwebtoken";
import { Result } from "type-result";

export type AuthRulesContext = {
	token: string;
	decryptedToken: any;
};
export interface IAuthRule {
	setNext(next: IAuthRule): IAuthRule;
	handle(
		request: Partial<AuthRulesContext>
	): Promise<Result<AuthRulesContext, string>>;
}

class RulesBuilder {
	private rules: Array<IAuthRule> = [];
	static Given<T extends IAuthRule>(
		type: interfaces.ServiceIdentifier<T>
	): RulesBuilder {
		const builder = new RulesBuilder();
		return builder.With(type);
	}
	With<T extends IAuthRule>(
		type: interfaces.ServiceIdentifier<T>
	): RulesBuilder {
		const rule = container.get<T>(type);
		this.rules.push(rule);
		return this;
	}
	Build(): IAuthRule {
		return this.rules.reduceRight((previous, current) =>
			current.setNext(previous)
		);
	}
}

@injectable()
export class BaseRule implements IAuthRule {
	private _next: IAuthRule;
	protected get next(): IAuthRule {
		return this._next ?? new EmptyRule();
	}

	setNext(next: IAuthRule): IAuthRule {
		this._next = next;
		return this;
	}
	handle(request: AuthRulesContext): Promise<Result<AuthRulesContext, string>> {
		return Promise.resolve(Result.ok(request));
	}
}
@injectable()
export class EmptyRule extends BaseRule {}

@provideSingleton(TokenIsExpiredRule)
export class TokenIsExpiredRule extends BaseRule {
	handle(request: AuthRulesContext): Promise<Result<AuthRulesContext, string>> {
		const now = new Date();
		const createdAt = addMinutes(
			parseISO(request.decryptedToken.createdAt),
			10
		);
		const tokenIsExpired = isAfter(now, createdAt);
		if (tokenIsExpired) return Promise.resolve(Result.fail("Expired token"));
		return this.next.handle(request);
	}
}

@provideSingleton(DecryptTokenRule)
export class DecryptTokenRule extends BaseRule {
	/**
	 *
	 */
	constructor(@config() private config: Configuration) {
		super();
	}

	handle(request: AuthRulesContext): Promise<Result<AuthRulesContext, string>> {
		try {
			const decryptedToken = jwt.decode(request.token);
			request.decryptedToken = decryptedToken;
			return this.next.handle(request);
		} catch {
			return Promise.resolve(Result.fail("Invalid token."));
		}
	}
}
@provideSingleton(FeatureToggleRule)
class FeatureToggleRule extends BaseRule {
	/**
	 *
	 */
	constructor(@config() private config: Configuration) {
		super();
	}
	async handle(
		request: AuthRulesContext
	): Promise<Result<AuthRulesContext, string>> {
		if (this.config.SESSION_VALIDATION_FEATURE.IsEnabled())
			return this.next.handle(request);
		return Result.ok(request);
	}
}
@provideSingleton(AuthService)
export class AuthService {
	private rules: IAuthRule;
	constructor() {
		this.rules = RulesBuilder.Given(DecryptTokenRule)
			.With(FeatureToggleRule)
			.With(TokenIsExpiredRule)
			.Build();
	}

	async Validade(request: Request): Promise<IUser> {
		const token = request.headers["authorization"]?.toString();
		const result = await this.rules.handle({
			token,
		});
		if (result.isFailure) throw new Error(result.getError());
		return result.getValue().decryptedToken.customer;
	}
}
