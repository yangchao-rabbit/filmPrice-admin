import request from '@/utils/request'

export interface User {
    id?: string
    name: string
    password?: string
    desc?: string
}


export const GetMeAPI = () => request.get('/api/system/me')

export const UserListAPI = (params: object) => request.get('/api/system/user', { params })

export const UserDetailAPI = (id: string) => request.get(`/api/system/user/${id}`)

export const UserCreateAPI = (data: object) => request.post('/api/system/user', data)

export const UserUpdateAPI = (id: string, data: object) => request.put(`/api/system/user/${id}`, data)

export const UserDeleteAPI = (id: string) => request.delete(`/api/system/user/${id}`)

export const GroupListAPI = (params: object) => request.get('/api/system/group', { params })

export const GroupDetailAPI = (id: string) => request.get(`/api/system/group/${id}`)

export const GroupCreateAPI = (data: object) => request.post('/api/system/group', data)

export const GroupUpdateAPI = (id: string, data: object) => request.put(`/api/system/group/${id}`, data)

export const GroupDeleteAPI = (id: string) => request.delete(`/api/system/group/${id}`)

export const PermListAPI = (params: object) => request.get('/api/system/perm', { params })

export const PermDetailAPI = (id: string) => request.get(`/api/system/perm/${id}`)