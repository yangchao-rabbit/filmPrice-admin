<template>
    <PageList
        :columns="Index.columns"
        :data="Index.data"
        :loading="Index.loading"
        :page="Index.page"
        title="权限列表"
        @refresh="Index.getList"
        @update:page="Index.updatePage"
    >
        <template #buttons>
            <!--            <el-button icon="Plus" type="primary" @click="Index.onAdd">新增</el-button>-->
        </template>
        <template #search>
            <el-select v-model="Index.search.method" clearable placeholder="方法" style="width: 100px">
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
                <el-option label="PUT" value="PUT"></el-option>
                <el-option label="DELETE" value="DELETE"></el-option>
            </el-select>
            <el-input v-model="Index.search.filter" clearable placeholder="请输入关键字" style="width: 150px" @keyup.enter="Index.getList" />
            <el-button icon="Search" type="info" @click="Index.getList">搜索</el-button>
        </template>

        <template #method="{ row }">
            <el-tag :type="methodColor[row.method]">{{ row.method }}</el-tag>
        </template>
    </PageList>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { type Perm, PermListAPI } from '@/api/system.ts'
import { ElMessage } from 'element-plus'
import { DateFormat } from '@/utils/format.ts'
import { DiaType, type IDia } from '@/types/diaType.ts'
import PageList from '@/components/PageList.vue'

// 方法颜色映射
const methodColor = {
    GET: 'primary',
    POST: 'success',
    PUT: 'warning',
    DELETE: 'danger',
}

const Index = reactive({
    search: {
        filter: '',
        method: '',
    },
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
    columns: [
        { label: 'ID', prop: 'id' },
        { label: '名称', prop: 'name', sortable: true },
        { label: '方法', prop: 'method', sortable: true },
        { label: '路径', prop: 'path', sortable: true },
        { label: '创建时间',prop: 'created_at', default: false, formatter: (row: any) => DateFormat(row.created_at) },
        { label: '更新时间',prop:'updated_at', default: false, formatter: (row: any) => DateFormat(row.updated_at) },
        { label: '描述', prop: 'desc' },
    ],
    data: [] as Perm[],
    loading: false,
    getList: async () => {
        Index.loading = true
        const resp = await PermListAPI({
            page: Index.page.current,
            page_size: Index.page.size,
            filter: Index.search.filter,
            method: Index.search.method,
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
})

onMounted(() => {
    Index.getList()
})
</script>

<style lang="scss" scoped></style>
