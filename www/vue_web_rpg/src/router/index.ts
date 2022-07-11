import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/components/Login.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
        },

        // Need to be connected
        {
            path: '/userpage',
            name: 'userpage',
            component: () => import('../views/UserPage.vue'),
        },
        {
            path: '/sheet',
            name: 'sheet',
            component: () => import('../views/SheetShow.vue'),
        },
    ],
})

export default router
