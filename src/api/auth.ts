import request from '@/utils/request'

export const LoginAPI = (data: object) => request.post('/api/auth/local-login', data)