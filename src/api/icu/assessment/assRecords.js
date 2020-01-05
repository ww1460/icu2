
import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/icu/assessRecord/page',
    method: 'get',
    params: query
  })
}

export function delRecod(id) {
  return request({
    url: '/icu//assessRecord/'+id,
    method: 'delete',
  })
}

export function getRecord(assessRecordId) {
  return request({
    url: '/icu/assessProjectRecord/getAssessRecord/'+assessRecordId,
    method: 'get',
  })
}

// export function getInfo(id) {
//   return request({
//     url: '/icu/patpatient/' + id,
//     method: 'get'
//   })
// }

export function putObj(obj) {
  return request({
    url: '/admin/tenant',
    method: 'put',
    data: obj
  })
}
export function getRecordView(query) {
  return request({
    url: '/icu/assessType/assessRecord',
    method: 'get',
    params: query
  })
}
// export function getCode(query) {
//   return request({
//     url: '/icu/project/page',
//     method: 'get',
//     params:query
//   })
// }