import axios from '@/axios'
import AuthService from '@/modules/auth/auth.service'
import { joinWithSlash } from '@/modules/common/services/url-utils'
import type { Sheet } from '@/modules/sheets/models/sheet.model'

export type SheetState = {
    sheet: Sheet
    sheets: Sheet[]
}
const state: SheetState = {
    sheet: undefined,
    sheets: [],
}
const getters = {
    sheet: (state) => state.sheet,
    sheets: (state) => state.sheets,
}
const actions = {
    async fetchSheet({ commit }, id: string) {
        const username = AuthService.loggedInUser()?.username
        return await axios.get(joinWithSlash(import.meta.env.VITE_API_URL, `sheets/${id}`)).then((response) => {
            commit('setSheet', response.data)
            return response.data
        })
    },
    fetchSheets({ commit }): Promise<Sheet> {
        const username = AuthService.loggedInUser()?.username
        return axios.get(joinWithSlash(import.meta.env.VITE_API_URL, `sheets?name=${username}`)).then((response) => {
            commit('setSheets', response.data)
            return response.data
        })
        // commit('setSheet', response.data)
    },
    async updateSheet(sheet) {
        // const response = await axios.post('http://localhost:8080/sheet/save/1', sheet);
    },
}
const mutations = {
    setSheet: (state, sheet) => (state.sheet = sheet),
    setSheets: (state, sheets) => (state.sheets = sheets),
}

export default {
    state,
    getters,
    actions,
    mutations,
}
