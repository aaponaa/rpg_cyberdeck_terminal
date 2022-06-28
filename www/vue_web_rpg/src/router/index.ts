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
      path: '/charview',
      name: 'charview',
      component: () => import('../views/CharSheet.vue')
    },
    {
      path: '/charmod',
      name: 'charmod',
      component: () => import('../views/CharMod.vue')
    },
    {
      path: '/usersheets',
      name: 'usersheets',
      component: () => import('../views/UserSheets.vue')
    },
    {
      path: '/userpage',
      name: 'userpage',
      component: () => import('../views/UserPage.vue')
    },
    {
      path: '/module',
      name: 'module',
      component: () => import('../views/ModuleTester.vue')
    }
  ]
})

export default router
