export interface ResponseData<T> {
    code: number
    msg: string
    data: T
}

export interface BaseListReq {
    page?: number
    page_size?: number
    filter?: string
}

export interface BaseListRes<T> {
    total: number
    rows: T[]
}

export interface ListResponseData<T> extends ResponseData<BaseListRes<T>> {}

export const PayType = ['按量计费', '包年包月']
