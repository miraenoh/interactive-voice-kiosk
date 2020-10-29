import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        adminUser: {
            id: undefined,
            name: undefined,
            storeName: undefined,
            isOpen: false
        }
    }
})