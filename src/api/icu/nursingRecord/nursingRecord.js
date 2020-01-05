
import request from '@/router/axios'

export function getRecords(obj) {
  return request({
    url: '/icu/projectRecordDuplicate/getReportOne',
    method: 'post',
    data: obj
  })
}
export const getDict= () =>{
  return request({
    url: '/admin/dict/type/' + 'project_type',
    method: 'get',
  })
}
export function getReport(obj) {
return request({
  url: '/icu/intakeRecord/getReport',
  method: 'post',
  data: obj
})
}

    export function getsection() {
        return request({
          url: '/admin/dept/AllDept',
          method: 'get',   
        })
      }
// export function addAss(obj) {
//   return request({
//     url: '/icu/assessProjectRecord/add',
//     method: 'post',
//     data: obj
//   })
// }

// export function getEch(query) {
//   return request({
//     url: '/icu/assessRecord/getMapData',
//     method: 'get',
//     params:query
//   })
// }

// // export function getInfo(id) {
// //   return request({
// //     url: '/icu/patpatient/' + id,
// //     method: 'get'
// //   })
// // }

// export function putObj(obj) {
//   return request({
//     url: '/admin/tenant',
//     method: 'put',
//     data: obj
//   })
// }
