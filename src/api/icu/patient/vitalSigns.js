import request from '@/router/axios'

//获取图表数据
export function fetchList(obj) {
  return request({
    url: '/icu/projectRecordDuplicate/getVital',
    method: 'post',
    data:obj
  })
}
export function getEchart(id) {
  return request({
    url: '/icu/projectRecord/getVital/' + id,
    method: 'get'
  })
}

export function updated(obj) {
  return request({
    url:'/icu/projectRecord/update',
    method:'post',
    data:obj
  })
}

export function updateAamend(obj) {
  return request({
    url:'/icu/projectRecordDuplicate/update',
    method:'post',
    data:obj
  })
}
