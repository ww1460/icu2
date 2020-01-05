import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/icu/device/userecord/selectPaging',
    method: 'get',
    params: query
  })
}


// export function addObj(obj) {
//   return request({
//     url: '/icu/userecord/add',
//     method: 'post',
//     data: obj
//   })
// }

export function getObj(id) {
  return request({
    url: '/icu/dict/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/icu/device/userecord/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/icu/device/userecord/update',
    method: 'post',
    data: obj
  })
}
