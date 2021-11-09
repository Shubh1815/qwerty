import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { getTokens } from ".";

export const axiosAuthAPIInstance = axios.create();
export const axiosAPIInstance = axios.create();

interface CustomAxioxRequestConfig extends AxiosRequestConfig {
    _retry?: boolean,
}

const getCookie = (name: string) => {
    const cookie = document.cookie
        .split(';').map(row => row.trimLeft())
        .find(row => row.startsWith(`${name}=`))

    if (cookie) {
        return cookie.split('=')[1];
    }
    return null;
}

const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value}; secure=true; path=/; SameSite=Lax`;
}

axiosAPIInstance.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT;
axiosAPIInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => error.response,
)

axiosAuthAPIInstance.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT;
axiosAuthAPIInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const config: CustomAxioxRequestConfig = error.config;

        if (error.response && error.response.status === 401 && !config._retry) {
            config._retry = true;

            const refresh = getCookie('refresh_token');
            const data = await getTokens(refresh);
            console.log(data)
            if (data.status === 200) {
                setCookie('access_token', data.response.access);
                setCookie('refresh_token', data.response.refresh);
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${data.response.access}`,
                }
                return axiosAPIInstance(config);
            }
        }

        return error.response;
    }
);
