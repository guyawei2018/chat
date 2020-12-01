import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    user: {},
    firendList: []
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
    }
  },
  actions: {
  },
  modules: {
  }
})
