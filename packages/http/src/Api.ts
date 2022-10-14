import { ContextManager } from "@jbootcaba/context";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from "axios";
import httpAdapter from "axios/lib/adapters/http";
//import { httpAdapter } from "axios/dist/node/axios.cjs";
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

export class Api {
	/**
	 * Creates an instance of Api.
	 *
	 * @param {import("axios").AxiosRequestConfig} [config] - axios configuration.
	 * @memberof Api
	 */
	protected api: AxiosInstance;
	public constructor(
		config?: Partial<AxiosRequestConfig>,
		...interceptors: IInterceptor[]
	) {
		const mainAdapter = config?.adapter || httpAdapter;
		config = Object.assign({}, config, {
			adapter: (c: AxiosRequestConfig): Promise<any> =>
				ContextManager.Context.runAndReturn(() => mainAdapter(c)),
		});
		this.api = axios.create(config);
		interceptors.forEach((it) => it.register(this.api));
	}
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
	public request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
		return this.api.request(config);
	}

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
	public get<T = any>(
		url: string,
		config?: AxiosRequestConfig
	): AxiosPromise<T> {
		return this.api.get(url, config);
	}

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
	public delete<T = any>(
		url: string,
		config?: AxiosRequestConfig
	): AxiosPromise<T> {
		return this.api.delete(url, config);
	}

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
	public head<T = any>(
		url: string,
		config?: AxiosRequestConfig
	): AxiosPromise<T> {
		return this.api.head(url, config);
	}

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
	public post<T = any, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig
	): AxiosPromise<T> {
		return this.api.post(url, data, config);
	}

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
	public put<T = any, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig
	): AxiosPromise<T> {
		return this.api.put(url, data, config);
	}

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
	public patch<T = any, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig
	): AxiosPromise<T> {
		return this.api.patch(url, data, config);
	}
}
