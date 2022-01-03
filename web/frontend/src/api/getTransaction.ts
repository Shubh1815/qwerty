import { axiosAuthAPIInstance as axios } from "./axios";
import { SuccessResponse } from '.';

export interface TransactionData {
    id: string,
    student: string,
    items: {
        product: string,
        quantity: number,
        price_per_quantity: string,
    }[],
    date: string,
    total_amount: string,
};

export interface TranscationResponse extends SuccessResponse<TransactionData[]> {
    count?: number,
    previous?: string | null,
    next?: string | null,
};

export const getTransactions = (access: string | null, page: number) => (
    axios.get<TranscationResponse>(`/transaction/?page=${page}`, {
        headers: {
            Authorization: `Bearer ${access}`,
        }
    }).then((res) => {
        if (res.status < 400) {
            return res.data;
        }
        return Promise.reject({ status: res.status, response: res.data });
    })
);
