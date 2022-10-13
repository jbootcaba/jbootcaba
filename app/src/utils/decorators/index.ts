import { inject } from "inversify";
import { DecoratorTarget } from "inversify/lib/annotation/decorator_utils";

export const Identifiers = {
	SOAP_CLIENT: Symbol.for("SOAP_CLIENT"),
	CHARACTER_API: Symbol.for("CHARACTER_API"),
};

export function CharacterApi() {
	return (
		target: DecoratorTarget<unknown>,
		propertyKey: string | symbol,
		parameterIndex: number
	) => {
		inject(Identifiers.CHARACTER_API)(target, propertyKey, parameterIndex);
	};
}
