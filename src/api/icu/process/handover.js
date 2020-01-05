import request from '@/router/axios'

export function transferRecordOldData(query) {
  return request({
    url: '/icu/transferRecord/oldData',
    method: 'get',
    params: query
  })
}

export function transferRecordTransferRecord(query) {
  return request({
    url: '/icu/transferRecord/transferRecord/' + query,
    method: 'get'
  })
}

export function transferRecordAdd(obj) {
  return request({
    url: '/icu/transferRecord/add',
    method: 'post',
    data: obj
  })
}

export function transferRecordUpdate(query) {
  return request({
    url: '/icu/transferRecord/update',
    method: 'post',
    data: query
  })
}

