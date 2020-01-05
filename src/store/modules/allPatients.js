import { setStore } from '@/util/store'
import { getnurse } from '@/api/icu/patient/index'


const allPatient = {
   state: {
      all_patients: [],
      patientMessage:{},
      nurseIndexFlag:false
   },
   actions: {
      // 根据科室获取病人信息和护士信息
      getAllPatients({ commit }) {
         return new Promise((resolve, reject) => {
            getnurse().then(response => {
               var data = []
               // console.log(response)
               if (response.data.data) {
                  response.data.data.forEach(i => {
                     if (i.hospitalBed) {
                        Object.assign(i.patient, { bedCode: i.hospitalBed.bedCode, bedId: i.hospitalBed.bedId, bedName: i.hospitalBed.bedName })
                        i.patient.patientName = i.patient.name;
                        data.push(i.patient);
                     } else {
                        data = undefined
                     }
                  });
               }else{
                  data = undefined
               }

               // console.log(data)
               commit('SET_ALL_PATIENTS', data)
               if (data) {
                  commit('SET_MESSAGE', data[0])
               }else{
                  commit('SET_MESSAGE', {})
               }
               resolve(data)
            }).catch(error => {
               reject(error)
            })
         })
      },
   },
   mutations: {
      SET_ALL_PATIENTS: (state, all_patients) => {
         state.all_patients = all_patients
         setStore({
            name: 'all_patients',
            content: state.all_patients,
            type: 'session'
         })
      },
      SET_MESSAGE:(state,patientMessage)=>{
         state.patientMessage =  patientMessage
         setStore({
            name: 'patientMessage',
            content: state.patientMessage,
            type: 'session'
         })
       },
       SET_NURSEINDEXFLAG:(state,nurseIndexFlag)=>{
         state.nurseIndexFlag = nurseIndexFlag
         setStore({
            name: 'nurseIndexFlag',
            content: state.nurseIndexFlag,
            type: 'session'
         })
       }
   }

}
export default allPatient
