import { axiosAuthAPIInstance as axios } from "./axios";
import { SuccessResponse } from ".";

export enum Categories {
    CANTEEN = "canteen",
    STATIONARY = "stationary",
    TRANSPORTATION = "transportion"
};

export interface ProductData {
    name: string,
    amount: string,
    category: Categories,
};

export interface ProductResponse extends SuccessResponse<ProductData[]> { };

export const getProduct = async (access: string | null, category: Categories | null) => {
    const url = category ? `/product/?category=${category}` : '/product/';

    return axios.get<ProductResponse>(url, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    }).then(res => {
        if (res.status < 400) {
            return res.data;
        }
        return Promise.reject({ status: res.status, response: res.data });
    });
};