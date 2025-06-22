<template>
    <el-dialog :before-close="detail.onClose" :model-value="show" :title="detail.title" destroy-on-close>
        <el-form ref="diaFormRef" :model="detail.data" :rules="detail.rules" label-suffix=":" label-width="120px">
            <el-form-item label="名称" prop="name">
                <el-input v-model="detail.data.name" clearable placeholder="请输入名称"></el-input>
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
import { GroupCreateAPI, GroupDetailAPI, GroupUpdateAPI } from '@/api/system.ts'
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
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    },
    getOne: async (id: number) => {
        const res = await GroupDetailAPI(id)
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
                    const create = await GroupCreateAPI(params)
                    if (create.code === 0) {
                        detail.onClose()
                        emits('onSubmit')
                        ElMessage.success('添加成功')
                    } else {
                        ElMessage.error(create.msg)
                    }
                    break
                case DiaType.Edit:
                    const update = await GroupUpdateAPI(props!.id, params)
                    if (update.code === 0) {
                        ElMessage.success('修改成功')
                        detail.onClose()
                        emits('onSubmit')
                    }
                    else {
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
                    detail.title = '新增组'
                    detail.data = {}
                    break
                case DiaType.Edit:
                    detail.title = '编辑组'
                    detail.getOne(props!.id)
                    break
            }
        }
    }
)
</script>

<style lang="scss" scoped></style>
