import { AxiosError, AxiosInstance } from "axios";
export interface IAuthorizationStrategy {
	getToken(api: AxiosInstance): Promise<string>;

	refreshToken(api: AxiosInstance): Promise<void>;

	isNecessaryRenewToken(api: AxiosInstance, error: AxiosError): boolean;
}
