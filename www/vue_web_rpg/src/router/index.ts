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
            path: '/sheets',
            name: 'sheets',
            component: () => import('../modules/sheets/components/MySheets.vue'),
        },
        {
            path: '/sheets/:id',
            name: 'sheet',
            component: () => import('../modules/sheets/components/CharacterSheet.vue'),
        },
    ],
})

export default router
