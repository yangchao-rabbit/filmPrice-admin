import request from '@/utils/request'

export const GetMeAPI = () => request.get('/api/v1/user/me')