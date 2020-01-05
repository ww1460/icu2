import { setStore } from '@/util/store'
import { depPatient } from '@/api/icu/matron/info/info'


const matron = {
  state: {
    dep_patients: []
  },
  actions: {
    // 根据科室获取病人信息和护士信息
    getPatientsByDep({ commit }) {
      return new Promise((resolve, reject) => {
        depPatient().then(response => {
          const data = response.data
          // console.log(data.data)
          commit('SET_DEP_PATIENTS', data.data)
          resolve(data.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
  },
  mutations: {
    SET_DEP_PATIENTS: (state, dep_patients) => {
      state.dep_patients = dep_patients
      setStore({
        name: 'dep_patients',
        content: state.dep_patients,
        type: 'session'
      })
    }
  }

}
export default matron
