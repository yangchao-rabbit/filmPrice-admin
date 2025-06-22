import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/Layout/index.vue'
import { getToken } from '@/utils/auth.ts'
import { staticRoutes } from '@/route/static.ts'
import Login from '@/views/login/index.vue'

const routes = [
    {
        name: 'Login',
        path: '/login',
        component: Login,
        meta: {
            title: '登录',
        },
    },
    {
        path: '/',
        redirect: '/dashboard',
        component: Layout,
        children: staticRoutes,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

// 重定向
router.beforeEach((to, _, next) => {
    // 修改页面标题
    if (to.meta.title) {
        document.title = to.meta.title as string + ' | ' + import.meta.env.VITE_TITLE
    }

    const token = getToken()

    if (!token && to.name !== 'Login' && to.name !== 'Auth') {
        next({ name: 'Login' })
    } else {
        next()
    }
})

export default router
