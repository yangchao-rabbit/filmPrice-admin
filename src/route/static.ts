export const staticRoutes = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
            id: 100,
            icon: 'House',
            title: '首页',
        },
    },
]
