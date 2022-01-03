import { axiosAuthAPIInstance as axios } from "./axios";
import { User as UserResponse } from '../context/Auth';
import { SuccessResponse } from ".";


export const getUser = (access: string | null) => (
    axios.post<SuccessResponse<UserResponse>>(
        '/user/',
        {},
        {
            headers: {
                Authorization: `Bearer ${access}`,
            }
        }
    ).then((res) => {
        if (res.status === 200) {
            return res.data;
        }
        return Promise.reject({ status: res.status, response: res.data });
    })
);