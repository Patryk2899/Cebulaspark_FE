import axios from "axios";
import {BaseResponse, PUBLIC_URL} from "./api-commons";

export const checkTokenValidity = async () => {
    if (localStorage.getItem("token") === null) {
        return false
    }
    return await axios.get(PUBLIC_URL + `${process.env.REACT_APP_CURRENT_USER}`, {
        headers: {
            Authorization: localStorage.getItem("token")
        }
    }).then(response => {
        return true
    })
        .catch(err => {
            localStorage.removeItem("token")
            return false
        });
};

export const getUserData = async (): Promise<UserData> => {
    const res = await axios.get(PUBLIC_URL + `${process.env.REACT_APP_CURRENT_USER}`, {
        headers:
                { Authorization: localStorage.getItem("token")}
        });
    return res.data.response;
};

export interface UserData {
    id: number;
    email: string;
    user_role: string;
    created_at: string;
    updated_at: string;
    jti: string;
}