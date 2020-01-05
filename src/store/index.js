import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import tags from './modules/tags'
import logs from './modules/logs'
import nurse from './modules/nurse'
import matron from './modules/matron'
import getters from './getters'
import allPatients from './modules/allPatients'
import personalSummary from './modules/personalSummary'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    common,
    logs,
    tags,
    nurse,
    matron,
    allPatients,
    personalSummary
  },
  getters
})

export default store
