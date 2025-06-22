<template>
    <div class="login-page">
        <div class="login-card">
            <div class="login-header">
                <h2>系统登录</h2>
            </div>

            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password" show-password clearable @keyup.enter="handleLogin" placeholder="请输入密码" />
                </el-form-item>

                <el-form-item>
                    <el-button style="width: 100%" class="login-button" type="primary" @click="handleLogin">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LoginAPI } from '@/api/auth'
import { useUserStore } from '@/stores/useUser'
import { useRouter } from 'vue-router'
import { setToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()


const form = ref({
    username: '',
    password: '',
})

const rules = ref({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const formRef = ref<FormInstance>()

const handleLogin = () => {
    formRef.value?.validate(async (valid) => {
        if (valid) {
            const res = await LoginAPI(form.value)
            if (res.code === 0) {

                setToken(res.data)

                ElMessage.success('登录成功')
                await router.push('/dashboard')
                
                userStore.getUserInfo()
            } else {
                ElMessage.error(res.msg)
            }
        }
    })
}
</script>

<style scoped lang="scss">
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url('@/assets/bg.jpg');
}

.login-card {
    width: 400px;
    padding: 30px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
    text-align: center;
    margin-bottom: 20px;
}

.login-form {
    max-width: 300px;

    .login-button {
        width: 100%;
    }
}
</style>
