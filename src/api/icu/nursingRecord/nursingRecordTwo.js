
import request from '@/router/axios'

export function getRecords(obj) {
  return request({
    url: '/icu/projectRecordDuplicate/getReportTwo',
    method: 'post',
    data: obj
  })
}
export function addRecords(obj) {
  return request({
    url: '/icu/projectRecordDuplicate/add',
    method: 'post',
    data: obj
  })
}
export function deleteRecords(id) {
  return request({
    url: '/icu/projectRecordDuplicate/del/' + id,
    method: 'delete',
  })
}
export function updateRecords(obj) {
  return request({
    url: '/icu/projectRecordDuplicate/update',
    method: 'post',
    data: obj
  })
}
export const getDict = () => {
  return request({
    url: '/admin/dict/type/' + 'project_type',
    method: 'get',
  })
}
export function getsection() {
  return request({
    url: '/admin/dept/AllDept',
    method: 'get',
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
