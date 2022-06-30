import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/UserRegister.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/UserLogin.vue')
    },

      // Need to be connected
    {
      path: '/userpage',
      name: 'userpage',
      component: () => import('../views/UserPage.vue')
    },
    {
      path: '/sheet',
      name: 'sheet',
      component: () => import('../views/SheetShow.vue')
    }
  ]
})

export default router
