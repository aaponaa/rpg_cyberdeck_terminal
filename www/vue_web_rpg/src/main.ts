import {createApp} from 'vue'
import router from './router'
import App from '@/App.vue'
import store from "@/store/index"
import i18n from '@/i18n'

const app = createApp(App)
    .use(i18n)
    .use(router)
    .use(store())
    .mount("#app")
