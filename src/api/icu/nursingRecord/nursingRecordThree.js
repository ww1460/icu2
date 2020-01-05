
import request from '@/router/axios'

export function getAssess(query) {
  return request({
    url: '/icu/nursingRecord/getReportThree',
    method: 'post',
    data: query
  })
}

export function addAss(obj) {
  return request({
    url: '/icu/assessProjectRecord/add',
    method: 'post',
    data: obj
  })
}

export function getEch(query) {
  return request({
    url: '/icu/assessRecord/getMapData',
    method: 'get',
    params: query
  })
}

    export function getsection() {
        return request({
          url: '/admin/dept/AllDept',
          method: 'get',   
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
