import { AxiosInstance, AxiosRequestConfig, AxiosPromise } from "axios";
import { IInterceptor } from "./IInterceptor";
/**
 * ES6 Axios Class.
 *
 * @class Api
 * @extends {Axios}
 * @example
 * class UserApi extends Api {
 *   public constructor (config) {
 *     super(config);
 *
 *     this.login=this.login.bind(this);
 *   }
 *
 *   public login (user: User) {
 *     return this.api.post<string, User, AxiosResponse<User>>("https://www.domain/login", {name: user.name, pass: user.pass})
 *        .then((res: AxiosResponse<string>) => res.data);
 *   }
 * }
 */
export declare class Api {
    /**
     * Creates an instance of Api.
     *
     * @param {import("axios").AxiosRequestConfig} [config] - axios configuration.
     * @memberof Api
     */
    protected api: AxiosInstance;
    constructor(config?: Partial<AxiosRequestConfig>, ...interceptors: IInterceptor[]);
    /**
     * Generic request.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP axios response payload.
     * @memberof Api
     *
     * @example
     * api.request({
     *   method: "GET|POST|DELETE|PUT|PATCH"
     *   baseUrl: "http://www.domain.com",
     *   url: "/api/v1/users",
     *   headers: {
     *     "Content-Type": "application/json"
     *  }
     * }).then((response: AxiosResponse<User>) => response.data)
     *
     */
    request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
    /**
     * HTTP GET method, used to fetch data `statusCode`: 200.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} HTTP `axios` response payload.
     * @memberof Api
     */
    get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    /**
     * HTTP DELETE method, `statusCode`: 204 No Content.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    /**
     * HTTP HEAD method.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    /**
     * HTTP POST method `statusCode`: 201 Created.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template B - `BODY`: body request object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {B} data - payload to be send as the `request body`,
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): AxiosPromise<T>;
    /**
     * HTTP PUT method.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template B - `BODY`: body request object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {B} data - payload to be send as the `request body`,
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): AxiosPromise<T>;
    /**
     * HTTP PATCH method.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template B - `BODY`: body request object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {B} data - payload to be send as the `request body`,
     * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    patch<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): AxiosPromise<T>;
}
//# sourceMappingURL=Api.d.ts.map