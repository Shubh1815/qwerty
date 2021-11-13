import { axiosAPIInstance as axios } from "./axios";
import { SuccessResponse, ErrorReponse } from ".";

interface FieldError {
    code: string,
    message: string,
}

export interface ResetPinSuccessResponse extends SuccessResponse<string> { };

export interface ResetPinErrorResponse extends ErrorReponse<{
    status: string,
    message: {
        non_field_errors?: FieldError[],
        pin?: FieldError[],
        pin2?: FieldError[]
    }
}> { };

export const resetPin = (formData: FormData) => (
    axios.post<ResetPinSuccessResponse>('/student/reset_pin/confirm/', formData)
        .then(res => {
            if (res.status < 400) {
                return res.data;
            }
            return Promise.reject({ status: res.status, response: res.data });
        })
)