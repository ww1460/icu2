import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/icu/pinping/userecord/selectPaging',
    method: 'get',
    params: query
  })
}

export function delObj(row) {
  return request({
    url: '/icu/pinping/userecord/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/icu/pinping/userecord/update',
    method: 'post',
    data: obj
  })
}
