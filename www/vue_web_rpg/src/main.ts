import { createApp } from 'vue'
import router from './router'
import App from '@/App.vue'
import store from '@/store'
import i18n from '@/i18n'
import setupAuthInterceptors from '@/modules/auth/auth.interceptors'

router.beforeEach((to, from, next) => {
    // store.dispatch('fetchAccessToken');
    if (to.fullPath !== '/login') {
        if (!store.state.auth.user) {
            next('/login')
        }
    }
    if (to.fullPath === '/login') {
        if (store.state.auth.user) {
            next('/')
        }
    }
    next()
})

setupAuthInterceptors(store)

const app = createApp(App).use(i18n).use(router).use(store).mount('#app')
