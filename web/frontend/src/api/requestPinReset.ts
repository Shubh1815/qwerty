import { axiosAPIInstance as axios } from "./axios";
import { ErrorReponse, SuccessResponse } from ".";

interface Payload {
    email: string,
}

interface FieldError {
    code: string,
    message: string
}

export interface ResetPinKey {
    key: string,
}

export interface RequestResetPinSuccessResponse extends SuccessResponse<ResetPinKey> { };

export interface RequestResetPinErrorResponse extends ErrorReponse<{
    status: string,
    message: {
        non_field_errors?: FieldError[],
        email?: FieldError[]
    }
}> { };

export const requestPinReset = (payload: Payload) => (
    axios.post<RequestResetPinSuccessResponse>('/student/reset_pin/', JSON.stringify(payload), {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => {
        if (res.status < 400) {
            return res.data;
        }
        return Promise.reject({ status: res.status, response: res.data });
    })
);