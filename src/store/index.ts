import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null')
  },
  mutations: {
    setUser (state, payload) {
      state.user = JSON.parse(payload)
      // 注意：本地存储只能存字符串, 将数据存入本地
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
