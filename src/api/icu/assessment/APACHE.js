
import request from '@/router/axios'

export function getAssess(query) {
  return request({
    url: '/icu/assessType/getAssess',
    method: 'get',
    params: query
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
    params:query
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

//患者中心   跌倒坠床跳转修改
export function putflow(obj) {
  return request({
    url: '/icu/processrecord/update',
    method: 'post',
    data: obj
  })
}