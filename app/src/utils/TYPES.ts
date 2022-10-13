import { TYPES as _type } from "@jbootcaba/inversify";
export const TYPES = {
	Cache: Symbol.for("Cache"),
	SOAP_CLIENT: Symbol.for("SOAP_CLIENT"),
	CHARACTERS_API: Symbol.for("SOAP_CLIENT"),
	..._type,
};
