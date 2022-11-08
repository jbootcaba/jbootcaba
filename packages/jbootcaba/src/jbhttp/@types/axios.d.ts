import "axios";
declare module "axios" {
	interface AxiosResponse {
		isFallback?: boolean;
	}
	interface AxiosRequestConfig {
		anonymous?: boolean;
		authenticating?: boolean;
		startTime?: number;
	}
}
