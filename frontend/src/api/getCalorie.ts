import { axiosAuthAPIInstance as axios } from "./axios";
import { SuccessResponse } from ".";

export interface Calories {
    date: string,
    calories: string,
}

export interface CalorieResponse extends SuccessResponse<Calories[]> { };

export const getCalorie = async (access: string | null, days: number = 7) => (
    axios.get<CalorieResponse>(`/tracker/calorie/?days=${days}`, {
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