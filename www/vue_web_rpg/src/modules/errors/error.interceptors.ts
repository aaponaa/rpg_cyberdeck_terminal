import type { Store } from 'vuex'
import axios from '@/axios'
import type { AxiosError } from 'axios'

const setup = (store: Store<any>) => {
    axios.interceptors.response.use(
        (response) => {
            return response
        },
        (error: AxiosError) => {
            const originalConfig = error.config
            if (!originalConfig?.url.includes('auth/refresh') && error.response) {
                if (error.response.status !== 401) {
                    store.commit('setError', error)
                }
            }
            return error;
        },
    )
}

export default setup
