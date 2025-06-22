import request from '@/utils/request'

export interface User {
    id?: string
    name: string
    password?: string
    desc?: string
}


export const GetMeAPI = () => request.get('/api/system/me')