import {AxiosResponse} from "axios";

export const PUBLIC_URL = `${process.env.REACT_APP_API_URL}`

export interface BaseResponseData<T> {
    status_code: string;
    response: T;
}

export type BaseResponse<T> = AxiosResponse<BaseResponseData<T>>;