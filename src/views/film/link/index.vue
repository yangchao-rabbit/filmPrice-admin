<template>
    <PageList
        :columns="Index.columns"
        :data="Index.data"
        :loading="Index.loading"
        :page="Index.page"
        title="胶片链接列表"
        @refresh="Index.getList"
        @update:page="Index.updatePage"
    >
        <template #buttons>
            <el-button icon="Plus" type="primary" @click="Index.onAdd">新增</el-button>
        </template>
        <template #search>
            <el-input v-model="Index.search" clearable placeholder="请输入关键字" style="width: 150px" @keyup.enter="Index.getList" />
            <el-button icon="Search" type="info" @click="Index.getList">搜索</el-button>
        </template>


        <template #table-columns>
            <el-table-column label="操作" width="140">
                <template #default="{ row }">
                    <el-button size="small" type="primary" @click="Index.onEdit(row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="Index.onDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </template>
    </PageList>

    <DialogModel v-bind="Index.dia" @close="Index.dia.show = false" @onSubmit="Index.getList" />
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { type FilmLink, FilmLinkDeleteAPI, FilmLinkListAPI } from '@/api/film.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DateFormat } from '@/utils/format.ts'
import { DiaType, type IDia } from '@/types/diaType.ts'
import DialogModel from './DialogModel.vue'
import PageList from '@/components/PageList.vue'

const Index = reactive({
    search: '',
    // 分页器
    page: {
        current: 1,
        size: 10,
        total: 0,
    },
    updatePage: (row: any) => {
        const { current, size } = row
        Index.page.size = size
        Index.page.current = current
    },
    data: [] as FilmLink[],
    loading: false,
    columns: [
        { label: 'ID', prop: 'id', default: false },
        { label: '胶片', prop: 'film.name' },
        { label: '平台', prop: 'platform' },
        { label: '名称', prop: 'name' },
        { label: '链接', prop: 'url', default: false },
        { label: '状态', prop: 'is_active' },
        { label: '创建时间', prop: 'created_at', default: false, formatter: (row: any) => DateFormat(row.created_at) },
        { label: '更新时间', prop: 'updated_at', default: false, formatter: (row: any) => DateFormat(row.updated_at) },
    ],
    getList: async () => {
        Index.loading = true
        const resp = await FilmLinkListAPI({
            page: Index.page.current,
            page_size: Index.page.size,
            filter: Index.search,
        })
        if (resp.code === 0) {
            Index.data = resp.data.rows
            Index.page.total = resp.data.total
        } else {
            ElMessage.error(resp.msg)
        }
        Index.loading = false
    },
    dia: {
        show: false,
        type: DiaType.View,
        id: 0,
    } as IDia,
    onAdd: () => {
        Index.dia = {
            show: true,
            type: DiaType.Add,
        }
    },
    onEdit: (id: number) => {
        Index.dia = {
            show: true,
            type: DiaType.Edit,
            id,
        }
    },
    onDelete: (row: any) => {
        ElMessageBox.confirm(`是否删除 [${row.name}] 胶片链接?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(async () => {
                const resp = await FilmLinkDeleteAPI(row.id)
                if (resp.code === 0) {
                    ElMessage.success('删除成功')

                    Index.getList()
                } else {
                    ElMessage.error(resp.msg)
                }
            })
            .catch(() => {
                ElMessage.info('已取消')
            })
    },
})

onMounted(() => {
    Index.getList()
})
</script>

<style lang="scss" scoped></style>
