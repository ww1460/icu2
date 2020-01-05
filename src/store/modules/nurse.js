import { setStore } from '@/util/store'
import { getObj } from '@/api/icu/nurse/wel_task'


const nurse = {
  state: {
    nurse_patients: []
  },
  actions: {
    // 根据护士ID获取护士对应的病人信息
    getPatientsByNurseId({ commit }) {
      return new Promise((resolve, reject) => {
        getObj().then(response => {
          const data = response.data
          // console.log(data.data)
          commit('SET_NURSE_PATIENTS', data.data)
          resolve(data.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
  },
  mutations: {
    SET_NURSE_PATIENTS: (state, nurse_patients) => {
      state.nurse_patients = nurse_patients
      setStore({
        name: 'nurse_patients',
        content: state.nurse_patients,
        type: 'session'
      })
    }
  }

}
export default nurse
