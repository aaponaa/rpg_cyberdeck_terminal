import axios from "axios";

const state ={
    sheet: []
}
const getters ={
    sheet: state => state.sheet
}
const actions = {
    async fetchSheet({ commit }){
        const response = await axios.get('http://localhost:8080/sheet/get/1');
        console.log(response.data.items)
        commit('setSheet', response.data.items)
    },
}
const mutations = {
    setSheet: (state, sheet) => (state.sheet = sheet)
}

export default{
    state,
    getters,
    actions,
    mutations
}