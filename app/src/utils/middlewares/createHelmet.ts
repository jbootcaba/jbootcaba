import { NodeEnv } from "@jbootcaba/config";
import { Configuration } from "../../configs/Configuration";
import helmet from "helmet";

export const createHelmet = (config: Configuration) => {
	const enableSecurityPolicies =
		config.NODE_ENV === NodeEnv.PRODUCTION ? undefined : false;
	const helmetConfig = {
		crossOriginEmbedderPolicy: enableSecurityPolicies,
		contentSecurityPolicy: enableSecurityPolicies,
	};
	return helmet(helmetConfig);
};
