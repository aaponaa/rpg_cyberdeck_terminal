
import {createStore} from 'vuex'
import Commit from 'vuex'


export default createStore({
    state: {
        authenticated: false
    },
    mutations: {
        SET_AUTH: (state: { authenticated: boolean }, auth: boolean) => state.authenticated = auth
    },
    actions: {
        setAuth: ({commit}: { // @ts-ignore
            commit: Commit }, auth: boolean) => commit('SET_AUTH', auth)
    },
    modules: {}
})