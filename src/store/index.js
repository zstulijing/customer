import { setPrototypeOf } from 'core-js/core/object'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    profile: {},
    otherPart: {},
    type: -1
  },
  mutations: {
    setProfile(state, profile) {
      state.profile = profile
    },
    setOtherPart(state, otherPart) {
      state.otherPart = otherPart
    },
    setType(state, type) {
      state.type = type
    }
  },
  actions: {
  },
  modules: {
  }
})
