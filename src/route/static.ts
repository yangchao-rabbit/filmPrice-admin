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
    {
        name: 'System',
        path: '/system',
        meta: {
            id: 900,
            icon: 'Setting',
            title: '系统管理',
        },
        children: [
            {
                name: 'SystemUser',
                path: '/system/user',
                component: () => import('@/views/system/user/index.vue'),
                meta: {
                    id: 901,
                    title: '用户管理',
                },
            },
            {
                name: 'SystemGroup',
                path: '/system/group',
                component: () => import('@/views/system/group/index.vue'),
                meta: {
                    id: 902,
                    title: '组管理',
                },
            },
            {
                name: 'SystemPerm',
                path: '/system/perm',
                component: () => import('@/views/system/perm/index.vue'),
                meta: {
                    id: 903,
                    title: '权限管理',
                },
            },
        ],
    },
]
