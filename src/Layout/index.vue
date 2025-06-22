<template>
    <el-container class="app-layout">
        <el-header class="layout-header">
            <div class="header-left">
                <span class="system-title">{{ title }}</span>
                <div class="collapse-btn">
                    <el-tooltip :content="isCollapse ? '展开' : '收起'">
                        <el-button :icon="!isCollapse ? 'Fold' : 'Expand'" plain @click="toggleCollapse" />
                    </el-tooltip>
                </div>
            </div>

            <div class="header-right">
                <!-- 全局功能示例：主题切换 & 全屏 -->
                <el-tooltip :content="isDark ? '明亮' : '暗黑'">
                    <el-switch v-model="isDark" active-icon="Moon" inactive-icon="Sunny" inline-prompt @change="darkChange"></el-switch>
                </el-tooltip>
                <el-tooltip content="全屏">
                    <el-icon class="header-icon" @click="toggleFullScreen">
                        <FullScreen />
                    </el-icon>
                </el-tooltip>

                <!-- 用户菜单 -->
                <el-dropdown trigger="click">
                    <span class="user-entry">
                        <el-avatar :src="userStore.info?.avatar" size="small" />
                        <span class="user-name">{{ userStore.info?.name }}</span>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>个人中心</el-dropdown-item>
                            <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </el-header>

        <el-container>
            <!-- ===== Aside ===== -->
            <el-aside :width="isCollapse ? '64px' : '200px'" class="layout-aside">
                <el-menu :collapse="isCollapse" :default-active="activeMenu" router unique-opened>
                    <el-menu-item index="/dashboard">
                        <el-icon>
                            <Menu />
                        </el-icon>
                        <span>首页</span>
                    </el-menu-item>
                    <el-sub-menu index="/asset">
                        <template #title>
                            <el-icon>
                                <Monitor />
                            </el-icon>
                            <span>资产</span>
                        </template>
                        <el-menu-item index="/asset/cloud">云账号管理</el-menu-item>
                        <el-menu-item index="/asset/project">云项目管理</el-menu-item>
                        <el-menu-item index="/asset/host">主机管理</el-menu-item>
                        <el-menu-item index="/asset/container">K8S节点管理</el-menu-item>
                        <el-menu-item index="/asset/db">Mysql管理</el-menu-item>
                        <el-menu-item index="/asset/es">ES管理</el-menu-item>
                        <el-menu-item index="/asset/redis">Redis管理</el-menu-item>
                        <el-menu-item index="/asset/kafka">Kafka管理</el-menu-item>
                        <el-menu-item index="/asset/mongo">MongoDB管理</el-menu-item>
                        <el-menu-item index="/asset/lb">LB管理</el-menu-item>
                        <el-menu-item index="/asset/tchouse">TCHouse管理</el-menu-item>
                        <el-menu-item index="/asset/tdsql">TDSql管理</el-menu-item>
                        <el-menu-item index="/asset/tdsqlc">TDSql-C管理</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="/task">
                        <template #title>
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>任务管理</span>
                        </template>
                        <el-menu-item index="/task/list">任务列表</el-menu-item>
                        <el-menu-item index="/task/log">任务日志</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="/system">
                        <template #title>
                            <el-icon>
                                <Setting />
                            </el-icon>
                            <span>系统管理</span>
                        </template>
                        <el-menu-item index="/system/user">用户管理</el-menu-item>
                        <el-menu-item index="/system/group">组管理</el-menu-item>
                        <el-menu-item index="/system/perm">权限管理</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-aside>
            <el-main class="layout-main">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { removeToken } from '@/utils/auth.ts'
import { useDark, useToggle } from '@vueuse/core'
import { useUserStore } from '@/stores/useUser.ts'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const userStore = useUserStore()

// 黑暗模式
const darkChange = () => {
    window.localStorage.setItem('dark', String(isDark.value))
    isDark.value = !isDark.value
    toggleDark()
}

const title = import.meta.env.VITE_TITLE

const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)
const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
}

const toggleFullScreen = () => {
    const el = document.documentElement
    if (!document.fullscreenElement) {
        el.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

watch(route, () => {
    activeMenu.value = route.path
})

const activeMenu = ref()

const logout = () => {
    ElMessage.success('已退出登录')
    router.push('/login')
    userStore.clearUserInfo()
    removeToken()
}

onMounted(() => {
    // 从localstorage中获取状态
    isDark.value = window.localStorage.getItem('dark') === 'true'

    userStore.getUserInfo()
})
</script>

<style lang="scss" scoped>
.app-layout {
    height: 100vh;
    color: var(--header-text);
}

.layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--layout-header-bg);
    color: var(--layout-header-text);
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    padding: 0 20px;
    height: 60px;
}

.header-left {
    display: flex;
    align-items: center;
    width: 200px;
    justify-content: space-between;

    .system-title {
        font-size: 18px;
        font-weight: 600;
    }

    .collapse-btn {
        margin-left: 20px;
    }
}

.header-right {
    display: flex;
    align-items: center;

    .header-icon {
        cursor: pointer;
        font-size: 18px;
        margin: 0 12px;
    }

    .user-entry {
        display: flex;
        align-items: center;
        cursor: pointer;

        .user-name {
            margin-left: 8px;
            font-size: 14px;
        }
    }
}

.layout-aside {
    transition: width 0.2s;
    background: var(--layout-sidebar-bg);
    color: var(--layout-sidebar-text);

    :deep(.el-menu) {
        background-color: var(--layout-sidebar-bg);
        color: var(--layout-sidebar-text);
        border-right: none;
    }

    :deep(.el-menu-item) {
        color: var(--layout-sidebar-text);
        transition: background 0.3s;

        &.is-active {
            background-color: rgba(255, 255, 255, 0.15);
        }

        &:hover {
            background-color: rgba(255, 255, 255, 0.08);
        }
    }

    :deep(.el-sub-menu__title) {
        color: var(--layout-sidebar-text);

        &:hover {
            background-color: rgba(255, 255, 255, 0.08);
        }
    }
}

.layout-main {
    padding: 0px;
    background: var(--layout-main-bg);
    overflow: auto;
}
</style>
