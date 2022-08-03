import { createApp } from 'vue'
import router from './router'
import App from '@/App.vue'
import store from '@/store'
import i18n from '@/i18n'
import setupAuthInterceptors, { ORIGINAL_URL } from '@/modules/auth/auth.interceptors'
import setupErrorInterceptors from '@/modules/errors/error.interceptors'
import AuthService from '@/modules/auth/auth.service'

import '@/assets/base.css'
import '@/assets/shadowrun-sheet.css'
import '@/assets/shadowrun.scss'

router.afterEach(guard => {
    store.commit('removeError')
})

router.beforeEach((to, from, next) => {
    if (to.fullPath !== '/login') {
        if (!store.state.auth.user) {
            localStorage.setItem(ORIGINAL_URL, to.fullPath)
            next('/login')
        } else next()
    } else if (to.fullPath === '/login') {
        if (store.state.auth.user) {
            next('/')
        } else next()
    } else next()
})

setupAuthInterceptors(store)
setupErrorInterceptors(store)

let app = createApp(App)

if (store.state.auth.user) {
    await AuthService.refreshToken().then(token => {
        store.commit('auth/refreshToken', token)
    }).catch(error => {
        AuthService.logout()
        store.commit('auth/logout')
    })
}
app.use(i18n).use(store).use(router).mount('#app')
app.config.globalProperties.$filters = {
    capitalize(value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
    },
}
