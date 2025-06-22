<template>
    <el-dialog :before-close="detail.onClose" :model-value="show" :title="detail.title" destroy-on-close>
        <el-form ref="diaFormRef" :model="detail.data" :rules="detail.rules" label-suffix=":" label-width="120px">
            <el-form-item label="名称" prop="name">
                <el-input v-model="detail.data.name" placeholder="请输入名称" type="text" />
            </el-form-item>
            <el-form-item label="别名" prop="alias">
                <el-input v-model="detail.data.alias" placeholder="请输入别名" type="text" />
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
                <el-select v-model="detail.data.brand" placeholder="请选择品牌">
                    <el-option v-for="item in FilmBrand" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="ISO" prop="iso">
                <el-input-number v-model="detail.data.iso" :min="0" :max="1000000" placeholder="请输入ISO" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="detail.data.type" placeholder="请选择类型">
                    <el-option v-for="item in FilmType" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="格式" prop="format">
                <el-select v-model="detail.data.format" placeholder="请选择格式" filterable :multiple="props.type === DiaType.Add">
                    <el-option v-for="item in FilmFormat" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="图片" prop="image">
                <el-input v-model="detail.data.image" placeholder="请输入图片链接" type="text" />
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
import { FilmCreateAPI, FilmDetailAPI, FilmUpdateAPI } from '@/api/film.ts'
import _ from 'lodash'
import { ElMessage, type FormInstance } from 'element-plus'
import { FilmBrand, FilmType, FilmFormat } from './index.ts'

const props = defineProps<IDia>()
const emits = defineEmits(['close', 'onSubmit'])

const diaFormRef = ref()

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

const detail = reactive({
    title: '',
    data: {} as Film,
    rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        alias: [{ required: true, message: '请输入别名', trigger: 'blur' }],
        brand: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
        iso: [{ required: true, message: '请输入ISO', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        format: [{ required: true, message: '请选择格式', trigger: 'change' }],
    },
    getOne: async (id: number) => {
        const res = await FilmDetailAPI(id)
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
            params.iso = params.iso.toString()
            switch (props.type) {
                case DiaType.Add:
                    // 如果格式是数组，则新增多个胶片
                    let allPromise = []
                    if (Array.isArray(params.format)) {
                        for (const format of params.format) {
                            allPromise.push(FilmCreateAPI({ ...params, format, alias: `${params.alias}-${format}` }))
                        }
                    } else {
                        allPromise.push(FilmCreateAPI(params))
                    }

                    let successCount = 0
                    const allResult = await Promise.all(allPromise)
                    for (const result of allResult) {
                        if (result.code === 0) {
                            successCount++
                        } else {
                            ElMessage.error(result.msg)
                        }
                    }

                    if (successCount === allPromise.length) {
                        ElMessage.success('添加成功')
                    } else {
                        ElMessage.error('添加失败')
                    }

                    detail.onClose()
                    emits('onSubmit')
                    break
                case DiaType.Edit:
                    const update = await FilmUpdateAPI(props!.id, params)
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
                    detail.title = '新增胶片'
                    detail.data = {}
                    break
                case DiaType.Edit:
                    detail.title = '编辑胶片'
                    detail.getOne(props!.id)
                    break
            }
        }
    }
)
</script>

<style lang="scss" scoped></style>
