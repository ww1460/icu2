import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/icu/device/page',
    method: 'get',
    params: query
  })
}


export function addObj(obj) {
  return request({
    url: '/icu/device/add',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/icu/device/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/icu/device/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/icu/device/update',
    method: 'post',
    data: obj
  })
}

