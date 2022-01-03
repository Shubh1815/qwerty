import { axiosAuthAPIInstance as axios } from "./axios";
import { SuccessResponse, TransactionData } from ".";


export interface TransactionBody {
    student: string,
    pin: string,
    items: {
        product: string,
        quantity: number
    }[],
};

export interface TransactionCreatedResponse extends SuccessResponse<TransactionData> { };

export interface TransactionCreatedErrorResponse<TMessage = any> {
    status: string,
    message?: TMessage,
};

export interface TransactionValidationError {
    'non_field_errors'?: {
        code: string,
        message: string,
    }[],
    'student'?: {
        code: string,
        message: string,
    }[],
    'pin'?: {
        code: string,
        message: string
    }[],
    'items'?: {
        'product'?: {
            code: string,
            message: string,
        }[],
        'quantity'?: {
            code: string,
            message: string,
        }[]
    }[],
};

export const postTransaction = (access: string, transaction: TransactionBody) => (
    axios.post<TransactionCreatedResponse>('/transaction/', JSON.stringify(transaction), {
        headers: {
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json',
        }
    }).then((res) => {
        if (res.status === 201) {
            return res.data;
        }
        return Promise.reject({ status: res.status, response: res.data });
    })
);
