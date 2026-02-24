import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue';
import adminRoutes from './admin.ts';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue'),
        },
        {
            path: '/news',
            name: 'News',
            component: () => import('../views/NewsView.vue'),
        },
        {
            path: '/reviews',
            name: 'Reviews',
            component: () => import('../views/ReviewsView.vue'),
        },
        {
            path: '/post/:postId',
            name: 'PostView',
            component: () => import('../views/PostView.vue'),
            props: true,
        },
        {
            path: '/deals',
            name: 'Deals',
            component: () => import('../views/DealsView.vue'),
        },
        {
            path: '/search',
            name: 'Search',
            component: () => import('../views/SearchView.vue'),
        },
        {
            path: '/tag/:tagId',
            name: 'Tag Search',
            component: () => import('../views/SearchView.vue'),
            props: true,
        },
        {
            path: '/contact',
            name: 'Contact',
            component: () => import('../views/Contact.vue'),
        },
        {
            path: '/rss-feeds',
            name: 'RSS Feeds',
            component: () => import('../views/RssFeeds.vue'),
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/Login.vue'),
        },
        // LEGALS
        {
            path: '/legals/privacy-policy',
            name: 'Privacy Policy',
            component: () => import('../views/legals/PrivacyPolicy.vue'),
        },
        {
            path: '/legals/cookie-policy',
            name: 'Cookie Policy',
            component: () => import('../views/legals/CookiePolicy.vue'),
        },
        {
            path: '/legals/terms-and-conditions',
            name: 'Terms & Conditions',
            component: () => import('../views/legals/TermsAndConditions.vue'),
        },
        ...adminRoutes,
    ],
});

router.afterEach((to) => {
    document.title = to.meta.title ? `${to.meta.title} | Outer Games` : 'Outer Games'
})


export default router
