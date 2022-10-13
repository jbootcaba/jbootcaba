import { ILogger } from "@jbootcaba/core";
import {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
} from "axios";
import { IInterceptor } from "./IInterceptor";

export class LoggerInterceptor implements IInterceptor {
	/**
	 *
	 */
	constructor(private logger: ILogger) {}

	register(axios: AxiosInstance): void {
		axios.interceptors.response.use(
			this.OnResponseFulfilledLogger.bind(this),
			this.OnResponseErrorLogger.bind(this)
		);

		axios.interceptors.request.use(
			this.OnRequestFulfilledLogger.bind(this),
			this.OnRequestErrorLogger.bind(this)
		);
	}

	private async OnRequestFulfilledLogger(
		axiosConfig: AxiosRequestConfig
	): Promise<AxiosRequestConfig> {
		this.logger.info(
			"BEGIN | REQ %s %s",
			axiosConfig.method?.toUpperCase(),
			axiosConfig.url
		);
		this.logger.debug("REQUEST BODY %s", axiosConfig.data);
		axiosConfig.startTime = Date.now();
		return axiosConfig;
	}
	safeParseJson(json: any): string {
		try {
			return JSON.stringify(json);
		} catch (e) {
			return "";
		}
	}
	private async OnResponseErrorLogger(error: AxiosError): Promise<unknown> {
		let startupDuration = 0;

		if (error.config?.startTime) {
			const startTime = error.config.startTime;
			startupDuration = Date.now() - startTime;
		}
		this.logger.error(
			"END | STATUS %s | TIME %sms | FROM CACHE FALSE | RES %s %s %s",
			error.response?.status || -1,
			startupDuration,
			error.config?.method?.toUpperCase() || "",
			error.config?.url,
			this.safeParseJson(error.response?.data)
		);

		this.logger.debug(
			"RESPONSE BODY %s %s",
			error.message || error.response?.data,
			error.stack
		);

		return Promise.reject(error);
	}

	private async OnResponseFulfilledLogger(response: AxiosResponse) {
		const startTime = response.config.startTime ?? Date.now();
		const startupDuration = Date.now() - startTime;
		const cached = response.request?.fromCache ? "TRUE" : "FALSE";
		const isFallback = response.isFallback ? "| FALLBACK " : "";
		this.logger.info(
			"END | STATUS %s | TIME %sms | FROM CACHE %s %s| RES %s %s",
			response.status || "",
			startupDuration,
			cached,
			isFallback,
			response.config.method?.toUpperCase() || "",
			response.config.url
		);

		this.logger.debug("RESPONSE BODY %s", response.data || "[empty]");

		return response;
	}

	private async OnRequestErrorLogger(error: AxiosError): Promise<unknown> {
		this.logger.error("REQUEST ERROR %s %s", error.message, error.stack);
		return Promise.reject(error);
	}
}
