import axios from '@/axios'
import AuthService from '@/modules/auth/auth.service'
import { joinWithSlash } from '@/modules/common/services/url-utils'

const state = {
    sheet: {},
}
const getters = {
    sheet: (state) => state.sheet,
}
const actions = {
    async fetchSheet({ commit }) {
        const username = AuthService.loggedInUser()?.username
        const response = await axios.get(joinWithSlash(import.meta.env.VITE_API_URL, `sheets/${username}`))
        console.log(response.data)
        // commit('setSheet', response.data)
    },
    async updateSheet(sheet) {
        // const response = await axios.post('http://localhost:8080/sheet/save/1', sheet);
    },
}
const mutations = {
    setSheet: (state, sheet) => (state.sheet = sheet),
}

export default {
    state,
    getters,
    actions,
    mutations,
}
