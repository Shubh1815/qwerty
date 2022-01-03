import { axiosAuthAPIInstance as axios } from "./axios";
import { SuccessResponse } from ".";

interface FieldError {
    code: string,
    message: string,
}

interface ValidationError {
    non_field_errors?: FieldError[],
    old_password?: FieldError[],
    password?: FieldError[],
    password2?: FieldError[]
}

interface Payload {
    old_password: string,
    password: string,
    password2: string,
}


export interface ChangePasswordSuccessResponse extends SuccessResponse<{
    access: string,
    refresh: string
}> { };

export interface ChangePasswordErrorResponse {
    status: string, message?: ValidationError
};


export const changePassword = (access: string | null, payload: Payload) => (
    axios.patch<ChangePasswordSuccessResponse>('/user/change_password/', JSON.stringify(payload), {
        headers: {
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json',
        },
    }).then(res => {
        if (res.status < 400) {
            return res.data;
        }
        return Promise.reject({ status: res.status, response: res.data });
    })
);