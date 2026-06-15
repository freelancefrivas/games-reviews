import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: Array<RouteRecordRaw> = [
    {
        path: '/admin',
        name: 'Admin',
        /*component: () => import('../views/admin/AdminHome.vue'),*/
        meta: {requiresAuth: true, layout: 'admin'},
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/admin/Dashboard.vue'),
                meta: { title: 'Dashboard' }
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('@/views/admin/Profile.vue'),
                meta: { title: 'Profile' }
            },
            {
                path: 'posts',
                name: 'Posts',
                component: () => import('@/views/admin/Posts.vue'),
                meta: { title: 'Posts' }
            },
            {
                path: 'users',
                name: 'Users',
                component: () => import('@/views/admin/Users.vue'),
                meta: { title: 'Users' }
            },
            {
                path: 'sales',
                name: 'Sales',
                component: () => import('@/views/admin/Sales.vue'),
                meta: { title: 'Sales' }
            },
            {
                path: 'posts/create',
                name: 'PostCreate',
                component: () => import('@/views/admin/Post.vue'),
                meta: { title: 'Create Post' }
            },
            {
                path: 'posts/:id/edit',
                name: 'PostEdit',
                component: () => import('@/views/admin/Post.vue'),
                meta: { title: 'Edit Post' }
            },
            {
                path: 'sales/create',
                name: 'SaleCreate',
                component: () => import('@/views/admin/Sale.vue'),
                meta: { title: 'Create Sale' }
            },
        ],
    },
]

export default adminRoutes