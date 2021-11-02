import { axiosAPIInstance as axios } from './axios';
import { ErrorReponse } from '.';

interface LoginError {
    detail?: string,
    email?: string[],
    password?: string[],
}

export interface TokenResponse {
    access: string,
    refresh: string,
}

export interface LoginErrorResponse extends ErrorReponse<LoginError> { };

export const login = (formData: FormData) => (
    axios.post<TokenResponse>('/token/', formData)
        .then((res) => {
            if (res.status < 400) {
                return res.data;
            }
            return Promise.reject({ status: res.status, response: res.data });
        })
);
