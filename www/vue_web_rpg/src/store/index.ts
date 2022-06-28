import Vuex from 'vuex'
import sheet from "@/store/modules/sheet";
import auth from '@/store/modules/auth'

export default () => new Vuex.Store({
    modules: {
        sheet,
        auth
    }
})
