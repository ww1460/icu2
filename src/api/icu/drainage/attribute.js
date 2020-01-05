
import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/icu/drainageattribute/selectPaging',
    method: 'get',
    params: query
  })
}
export function addObj(obj) {
  return request({
    url: '/icu/drainage/add',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/dict/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/icu/drainageattribute/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/icu/drainageattribute/updata',
    method: 'post',
    data: obj
  })
}

export function remote(type) {
  return request({
    url: '/admin/dict/type/' + type,
    method: 'get'
  })
}
