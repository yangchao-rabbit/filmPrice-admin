<template>
    <el-dialog :before-close="detail.onClose" :model-value="show" :title="detail.title" destroy-on-close>
        <el-form ref="diaFormRef" :model="detail.data" :rules="detail.rules" label-suffix=":" label-width="120px">
            <el-form-item label="胶片" prop="film_id">
                <el-select v-model="detail.data.film_id" placeholder="请选择胶片">
                    <el-option v-for="item in Film.data" :key="item.id" :label="item.alias" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="平台" prop="platform">
                <el-select v-model="detail.data.platform" placeholder="请选择平台">
                    <el-option v-for="item in FilmPlatform" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="detail.data.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="链接" prop="url">
                <el-input v-model="detail.data.url" placeholder="请输入链接" />
            </el-form-item>
            <el-form-item label="状态" prop="is_active">
                <el-switch v-model="detail.data.is_active" />
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
import { FilmLinkCreateAPI, FilmLinkDetailAPI, FilmLinkUpdateAPI, type Film, FilmListAPI } from '@/api/film.ts'
import _ from 'lodash'
import { FilmPlatform } from './index.ts'
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
        film_id: [{ required: true, message: '请选择胶片', trigger: 'change' }],
        platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入链接', trigger: 'blur' }],
        is_active: [{ required: true, message: '请选择状态', trigger: 'change' }],
    },
    getOne: async (id: number) => {
        const res = await FilmLinkDetailAPI(id)
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
                    const create = await FilmLinkCreateAPI(params)
                    if (create.code === 0) {
                        detail.onClose()
                        emits('onSubmit')
                        ElMessage.success('添加成功')
                    } else {
                        ElMessage.error(create.msg)
                    }
                    break
                case DiaType.Edit:
                    const update = await FilmLinkUpdateAPI(props!.id, params)
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

const Film = reactive({
    data: [] as Film[],
    getList: async (filter?: string) => {
        const res = await FilmListAPI({ filter, page_size: 20 })
        if (res.code === 0) {
            Film.data = res.data.rows
        }
    },
})

watch(
    () => props.show,
    (val) => {
        if (val) {
            Film.getList()

            switch (props.type) {
                case DiaType.Add:
                    detail.title = '新增胶片链接'
                    detail.data = {
                        is_active: true,        
                    }
                    break
                case DiaType.Edit:
                    detail.title = '编辑胶片链接'
                    detail.getOne(props!.id)
                    break
            }
        }
    }
)
</script>

<style lang="scss" scoped></style>
