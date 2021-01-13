import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    user: {},
    firendList: [],
    timeOut: null
  },
  mutations: {
    EDIT_TOKEN (state, token) {
      state.token = token
    },
    EDIT_FRIENDLIST (state, firendList) {
      state.firendList = firendList
    },
    EDIT_USER (state, user) {
      state.user = user
    },
    TIMEOUT (state, timeOut) {
      state.timeOut = timeOut
    }
  },
  actions: {
  },
  modules: {
  }
})
