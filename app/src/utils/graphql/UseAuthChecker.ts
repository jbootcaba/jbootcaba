import { AuthChecker } from "type-graphql";
import { Request } from "express";
import { AuthService } from "../../services/AuthService";

export const UseAuthChecker = (
	authService: AuthService
): AuthChecker<Request> => {
	const checker: AuthChecker<Request> = async (
		{ context },
		roles
	): Promise<boolean> => {
		const user = await authService.Validade(context);
		context.user = user;
		if (roles.length === 0) {
			// if `@Authorized()`, check only if user exists
			return user !== undefined;
		}
		// there are some roles defined now

		if (!user) {
			// and if no user, restrict access
			return false;
		}
		if (user.roles?.some((role) => roles.includes(role))) {
			// grant access if the roles overlap
			return true;
		}

		// no roles matched, restrict access
		return false;
	};
	return checker;
};
