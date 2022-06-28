import axios from "axios";

const state ={
    sheet: [
        {
            id : 1,
            item: "Life"
        },
        {
            id : 2,
            item: "Assets"
        },
        {
            id : 3,
            item: "wesh"
        },
        {
            id : 4,
            item: "Tamer"
        }
    ]
}
const getters ={
    allArticles: state => state.sheet
}
const actions = {

}
const mutations = {

}

export default{
    state,
    getters,
    actions,
    mutations
}