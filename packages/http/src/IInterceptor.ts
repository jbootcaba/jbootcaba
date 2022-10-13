import { AxiosInstance } from "axios";

export interface IInterceptor {
	register(axios: AxiosInstance): void;
}
