<template>
    <el-dialog :before-close="detail.onClose" :model-value="show" :title="detail.title" destroy-on-close>
        <el-form ref="diaFormRef" :model="detail.data" :rules="detail.rules" label-suffix=":" label-width="120px">
            <el-form-item label="类型" prop="type">
                <el-select v-model="detail.data.type" placeholder="请选择">
                    <el-option label="本地用户" value="local"></el-option>
                    <el-option label="Lark用户" value="lark"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户名" prop="name">
                <el-input v-model="detail.data.name" clearable placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item v-if="detail.data.type === 'local'" label="密码" prop="password">
                <el-input v-model="detail.data.password" clearable placeholder="请输入密码" show-password type="password"></el-input>
            </el-form-item>
            <el-form-item v-if="detail.data.type === 'lark'" label="OpenID" prop="open_id">
                <el-input v-model="detail.data.open_id" clearable placeholder="请输入OpenID, Lark用户必填"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="detail.data.email" clearable placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-input v-model="detail.data.avatar" clearable placeholder="请输入头像链接"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
                <el-input v-model="detail.data.desc" placeholder="请输入描述" type="text" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="detail.onClose">取消</el-button>
            <el-button type="primary" @click="detail.onSubmit">提交</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { DiaType, type IDia } from '@/types/diaType.ts'
import { reactive, ref, watch } from 'vue'
import { UserCreateAPI, UserDetailAPI, UserUpdateAPI } from '@/api/system.ts'
import _ from 'lodash'
import { ElMessage, type FormInstance } from 'element-plus'

const props = defineProps<IDia>()
const emits = defineEmits(['close', 'onSubmit'])

const diaFormRef = ref()

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

const detail = reactive({
    title: '',
    data: {},
    rules: {
        type: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
        name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
        open_id: [{ required: true, message: '请输入用户OpenID', trigger: 'blur' }]
    },
    getOne: async (id: number) => {
        const res = await UserDetailAPI(id)
        detail.data = res.data
    },
    onClose: () => {
        resetForm(diaFormRef.value)
        emits('close')
    },
    onSubmit: () => {
        diaFormRef.value.validate(async (valid) => {
            if (!valid) return
            // 参数
            const params = _.clone(detail.data)

            switch (props.type) {
                case DiaType.Add:
                    const create = await UserCreateAPI(params)
                    if (create.code === 0) {
                        detail.onClose()
                        emits('onSubmit')
                        ElMessage.success('添加成功')
                    } else {
                        ElMessage.error(create.msg)
                    }
                    break
                case DiaType.Edit:
                    const update = await UserUpdateAPI(props!.id, params)
                    if (update.code === 0) {
                        ElMessage.success('修改成功')
                        detail.onClose()
                        emits('onSubmit')
                    } else {
                        ElMessage.error(update.msg)
                    }
            }
        })
    },
})

watch(
    () => props.show,
    (val) => {
        if (val) {
            switch (props.type) {
                case DiaType.Add:
                    detail.title = '新增用户'
                    detail.data = {}
                    break
                case DiaType.Edit:
                    detail.title = '编辑用户'
                    detail.getOne(props!.id)
                    break
            }
        }
    }
)
</script>

<style lang="scss" scoped></style>
