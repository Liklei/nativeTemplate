import Vue from "vue"
import Vuex from 'vuex'

import Pay from './module/pay'

Vue.use(Vuex)


export default new Vuex.Store({
    modules: {
        Pay
    }
})