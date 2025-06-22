import { defineStore } from 'pinia'
import { ref } from 'vue'
import { GetMeAPI, type User } from '@/api/system.ts'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore(
    'user',
    () => {
        const info = ref<User | null>(null)

        const getUserInfo = async () => {
            const res = await GetMeAPI()
            if (res.code === 0) {
                info.value = res.data
            } else {
                ElMessage.warning(res.msg)
            }
        }

        const clearUserInfo = () => {
            info.value = null
        }

        return {
            info,
            getUserInfo,
            clearUserInfo,
        }
    },
    {
        persist: true,
    }
)
