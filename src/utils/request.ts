import axios from 'axios'
import { getToken } from '@/utils/auth.ts'
import { ElMessage } from 'element-plus'

// 创建axios实例
const request = axios.create({
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
})

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        const { data } = response

        return data
    },
    (error) => {
        const { data } = error.response
        if (data.code !== 0) {
            ElMessage.error(data.msg)
        }

        return Promise.reject(error)
    }
)

export default request
