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
    formRef.value?.validate((valid) => {
        if (valid) {
            console.log('submit')
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
