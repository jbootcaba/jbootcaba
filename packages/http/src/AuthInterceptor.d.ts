import { AxiosInstance, AxiosRequestConfig } from "axios";
import { IInterceptor } from "./IInterceptor";
import { IAuthorizationStrategy } from "./IAuthorizationStrategy";
export declare class AuthInterceptor implements IInterceptor {
    private strategy;
    private api;
    private _token?;
    token(): Promise<string>;
    constructor(strategy: IAuthorizationStrategy);
    register(axios: AxiosInstance): void;
    private OnResponseFulfilled;
    InjectToken(axiosConfig: AxiosRequestConfig, token: string): void;
    private RequestInjectToken;
    private ResponseAuthError;
}
//# sourceMappingURL=AuthInterceptor.d.ts.map