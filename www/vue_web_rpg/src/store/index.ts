import Vuex, {Store} from 'vuex'
import sheet from "@/store/modules/sheet";
import {auth} from '@/modules/auth/auth.store'

const store: Store<any> = new Vuex.Store({
    modules: {
        sheet,
        auth
    }
});

export default store;
