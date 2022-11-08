import { ILogger } from "@jbootcaba/core";
import { timeout, TimeoutStrategy } from "cockatiel";
export interface TimeoutConfig {
	globalDuration: number;
	requestDuration: number;
}

export const timeoutPolicy = (config: TimeoutConfig, logger: ILogger) => {
	const timeoutPolicy = timeout(
		config.globalDuration,
		TimeoutStrategy.Cooperative
	);

	timeoutPolicy.onTimeout(() => {
		logger.warn("Request Timeout after %s.", config.globalDuration);
	});
	return timeoutPolicy;
};
