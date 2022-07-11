import AuthService from '@/modules/auth/auth.service'
import router from '@/router'

const state = {
    user: AuthService.loggedInUser(),
}
const getters = {}
const actions = {
    login({ commit }, user: { username: string; password: string }) {
        return AuthService.login(user.username, user.password).then(
            (user) => {
                commit('loginSuccess', user)
                return user
            },
            (error) => {
                commit('loginFailure')
                return Promise.reject(error)
            },
        )
    },
    register({ commit }, user: { username: string; password: string }) {
        return AuthService.register(user.username, user.password).then(
            (user) => {
                commit('loginSuccess', user)
                return user
            },
            (error) => {
                commit('loginFailure')
                return Promise.reject(error)
            },
        )
    },
    refreshToken({ commit }, token) {
        commit('refreshToken', token)
    },
    logout({ commit }) {
        AuthService.logout()
        commit('logout')
        router.push('/login')
    },
}
const mutations = {
    loginSuccess(state, user) {
        state.user = user
    },
    loginFailure(state) {
        state.user = null
    },
    refreshToken(state, token) {
        state.user = {
            ...state.user,
            token,
        }
    },
    logout(state) {
        state.user = null
    },
}

export const auth = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
