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
            },
            {
                path: 'posts',
                name: 'Posts',
                component: () => import('@/views/admin/Posts.vue'),
            },
            {
                path: 'users',
                name: 'Users',
                component: () => import('@/views/admin/Users.vue'),
            },
        ],
    },
]

export default adminRoutes