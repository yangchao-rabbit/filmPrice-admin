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
        name: 'Film',
        path: '/film',
        meta: {
            id: 200,
            icon: 'Film',
            title: '胶片管理',
        },
        children: [
            {
                name: 'FilmList',
                path: '/film/list',
                component: () => import('@/views/film/index/index.vue'),
                meta: {
                    id: 201,
                    title: '胶片列表',
                },
            },
            {
                name: 'FilmLink',
                path: '/film/link',
                component: () => import('@/views/film/link/index.vue'),
                meta: {
                    id: 202,
                    title: '胶片链接',
                },
            },
            {
                name: 'FilmPrice',
                path: '/film/price',
                component: () => import('@/views/film/price/index.vue'),
                meta: {
                    id: 203,
                    title: '胶片价格',
                },
            },
            {
                name: 'FilmPriceHistory',
                path: '/film/price-history',
                component: () => import('@/views/film/history/index.vue'),
                meta: {
                    id: 204,
                    title: '胶片历史历史',
                },
            },
        ],
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
