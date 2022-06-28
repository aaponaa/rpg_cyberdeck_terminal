import Vuex from 'vuex'
import sheet from "@/store/modules/sheet";


export default () => new Vuex.Store({
    modules: {
        sheet
    }
})