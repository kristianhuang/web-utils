import axios, { AxiosError, AxiosRequestConfig } from "axios";
// import { Response } from "@/types/request";

/**
 * Response is response general data.
 */
interface Response {
  message?: string;
  code?: number;
}

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_URL, // url = base url + request url
  baseURL: "localhost:8080",
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  //headers: { "Content-Type": "text/plain; charset=utf-8" }
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    // setToken(config);
    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  }
);

/**
 * Example:
 * ```ts
 *   interface Data extends Resp {
 *      name: string;
 *      age: number;
 *      message?: string;
 *      code?: number;
 *    }
 *
 *    const fetch = async () => {
 *      try {
 *        const res = await request<Data>({
 *          url: "url",
 *         method: "get",
 *       });
 *       console.log(res);
 *     } catch (err) {
 *        const respErr = err as Response;
 *       console.log(respErr);
 *      }
 *    };
 * ```
 */
const request = async <T extends Response>(config: AxiosRequestConfig) => {
  try {
    const resp = await service.request<T>(config);
    return resp.data;
  } catch (err) {
    const axiosErr = err as AxiosError;
    if (axiosErr.response?.data == undefined) {
      return Promise.reject<T>(withNetworkErr());
    }

    return Promise.reject<T>(axiosErr.response?.data);
  }
};

const withNetworkErr = () => ({ message: "网络错误", code: 0 });

export default request;
