<template>
    <el-card class="page-card">
        <!-- 第一行：标题 -->
        <template #header>
            <div class="page-header__title">{{ title }}</div>

            <!-- 第二行：按钮 + 搜索 -->
            <div class="page-header">
                <div class="page-header__left">
                    <slot name="buttons" />
                </div>
                <div class="page-header__right">
                    <slot name="search" />
                    <!-- 配置列按钮 -->
                    <el-tooltip content="配置列">
                        <el-button icon="Setting" @click="showColDialog = true" />
                    </el-tooltip>
                </div>
            </div>
        </template>

        <!-- 表格主体 -->
        <el-table v-loading="loading" :data="data" border>
            <template v-for="col in visibleColumns" :key="col.prop || col.type">
                <!-- 内置类型列：直接渲染 -->
                <el-table-column v-if="col.type" v-bind="col" />

                <!-- 自定义数据列 -->
                <el-table-column v-else v-bind="col">
                    <!-- 具名插槽优先 -->
                    <template v-if="$slots[col.prop]" #default="scope">
                        <slot :name="col.prop" v-bind="scope" />
                    </template>

                    <!-- formatter 次之 -->
                    <template v-else-if="col.formatter" #default="scope">
                        {{ col.formatter(scope.row, scope.column, getValueByPath(scope.row, col.prop), scope.$index) }}
                    </template>

                    <!-- 默认取值（支持嵌套路径） -->
                    <template v-else #default="scope">
                        {{ getValueByPath(scope.row, col.prop) }}
                    </template>
                </el-table-column>
            </template>

            <!-- 自定义扩展列 -->
            <slot name="table-columns" />
        </el-table>

        <!-- 分页 -->
        <el-pagination
            v-model:current-page="page.current"
            v-model:page-size="page.size"
            :page-sizes="[10, 20, 30, 50]"
            :total="page.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="pageChange"
            @current-change="pageChange"
        />

        <!-- 配置列弹窗 -->
        <el-dialog v-model="showColDialog" title="配置显示列" width="400px">
            <el-checkbox-group v-model="visibleKeys">
                <el-checkbox
                    v-for="col in columns"
                    :key="col.prop || col.type"
                    :label="col.prop"
                >
                    {{ col.label || col.prop || col.type }}
                </el-checkbox>
            </el-checkbox-group>
            <template #footer>
                <el-button @click="resetCols">重置</el-button>
                <el-button type="primary" @click="showColDialog = false">确定</el-button>
            </template>
        </el-dialog>
    </el-card>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

interface PageInfo {
    current: number
    size: number
    total: number
}

interface Column {
    label?: string
    prop?: string
    slot?: string
    default?: boolean
    type?: string

    [key: string]: any
}

const props = defineProps<{
    title?: string
    data: any[]
    loading: boolean
    columns: Column[]
    page: PageInfo
}>()

const emit = defineEmits(['update:page', 'refresh'])

const showColDialog = ref(false)
const visibleKeys = ref<string[]>([])

// 初始化 visibleKeys
const initKeys = () => {
    visibleKeys.value = props.columns.filter((col) => col.default !== false).map((col) => col.prop)
}

// 可见列
const visibleColumns = computed(() => props.columns.filter((col) => visibleKeys.value.includes(col.prop)))

watch(() => props.columns, initKeys, { immediate: true })

const pageChange = () => {
    emit('update:page', {...props.page})
    emit('refresh')
}

const getValueByPath = (obj: any, path?: string) => {
    if (!obj || !path) return ''
    return path.split('.').reduce((res, key) => (res ? res[key] : undefined), obj)
}

const resetCols = () => {
    initKeys()
}
</script>

<style lang="scss" scoped>
.page-card {
    margin: 20px;
    

    .el-pagination {
        margin-top: 20px;
    }
}
.page-header__title {
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 8px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    padding-top: 4px;
}

.page-header__left,
.page-header__right {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>
