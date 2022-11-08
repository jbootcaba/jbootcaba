import {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
} from "axios";
import { IInterceptor } from "./IInterceptor";
import { IAuthorizationStrategy } from "./IAuthorizationStrategy";
export class AuthInterceptor implements IInterceptor {
	private api: AxiosInstance;
	private _token?: string;
	public async token(): Promise<string> {
		if (!this._token) this._token = await this.strategy.getToken(this.api);
		return this._token;
	}

	constructor(private strategy: IAuthorizationStrategy) {}

	register(axios: AxiosInstance): void {
		this.api = axios;
		axios.interceptors.request.use(this.RequestInjectToken.bind(this));
		axios.interceptors.response.use(
			this.OnResponseFulfilled.bind(this),
			this.ResponseAuthError.bind(this)
		);
	}
	private async OnResponseFulfilled(response: AxiosResponse) {
		return response;
	}

	public InjectToken(axiosConfig: AxiosRequestConfig, token: string): void {
		axiosConfig.headers = axiosConfig.headers ?? {};
		axiosConfig.headers.Authorization = token;
	}

	private async RequestInjectToken(
		axiosConfig: AxiosRequestConfig
	): Promise<AxiosRequestConfig> {
		if (axiosConfig.anonymous) return axiosConfig;
		const token = await this.token();
		this.InjectToken(axiosConfig, token);
		return axiosConfig;
	}

	private async ResponseAuthError(error: AxiosError): Promise<unknown> {
		const status = error?.response?.status;
		const authenticating =
			error && error.config ? error.config.authenticating : false;
		if (
			!authenticating &&
			status &&
			this.strategy.isNecessaryRenewToken(this.api, error)
		) {
			error.config = error.config || {};
			error.config.authenticating = true;
			await this.strategy.refreshToken(this.api);
			return this.api.request(error.config);
		}

		return Promise.reject(error);
	}
}
