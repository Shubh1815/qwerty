import { axiosAuthAPIInstance as axios } from "./axios";
import { SuccessResponse } from ".";

export interface Expenditure {
    date: string,
    expenditure: string,
}

export interface ExpenditureResponse extends SuccessResponse<Expenditure[]> { };

export const getExpense = async (access: string | null, days: number = 7) => (
    axios.get<ExpenditureResponse>(`/tracker/expense/?days=${days}`, {
        'headers': {
            'Authorization': `Bearer ${access}`,
        },
    }).then((res) => {
        if (res.status < 400) {
            return res.data;
        }
        return Promise.reject({ status: res.status, response: res.data });
    })
);