import { createStore, Store } from 'vuex'
import sheet, { SheetState } from '@/modules/sheets/sheet.store'
import { auth, AuthState } from '@/modules/auth/auth.store'
import type { AxiosError } from 'axios'

export type StoreState = {
    global: {
        error: AxiosError
    }
    auth: AuthState
    sheet: SheetState
}

const globalStore = {
    state: {
        error: null,
    },
    getters: {
        getError: (state) => {
            return state.error
        },
    },
    mutations: {
        setError: (state, error: AxiosError) => {
            state.error = error
        },
        removeError: (state) => {
            state.error = null
        },
    },
}

const store: Store<StoreState> = createStore({
    modules: {
        global: globalStore,
        sheet,
        auth,
    },
})

export default store
