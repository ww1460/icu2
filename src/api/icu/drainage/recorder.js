
import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/icu/drainagerecords/selectPaging',
    method: 'get',
    params: query
  })
}

export function pipe(query) {
  return request({
    url: '/icu/drainagerecords/preJump',
    method: 'post',
    data: query
  })
}
export function dictionary() {
  return request({
    url: '/admin/dict/type/drainage_attribute',
    method: 'get'
  })
}

export function liquid(pipingId) {
  return request({
    url: '/icu/drainagerecords/selectDrainageRecords',
    method: 'post',
    data: {
      pipingId: pipingId
    }
  })
}

export function addObj(piping, patientId, drainageId, nameType, measu, form) {
  return request({
    url: '/icu/drainagerecords/add',
    method: 'post',
    data: {
      pipingId: piping,
      patientId: patientId,
      drainageId: drainageId,
      drainageAttributeId: nameType,
      measures: measu,
      value: form.value,
      normal: form.resource
    }
  })
}

export function delObj(row) {
  return request({
    url: '/icu/drainagerecords/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/icu/drainagerecords/update',
    method: 'post',
    data: obj
  })
}
