import request from '@/router/axios'

export function fetchwaiting(query) {
  return request({
    url: '/icu/hispatient/page',
    method: 'get',
    params: query
  })
}

export function fetchalready(query) {
  return request({
    url: '/icu/patpatient/page',
    method: 'get',
    params: query
  })
}
export function fetchbeds(obj) {
  return request({
    url: '/icu/hospitalBed/page',
    method: 'get',
    params: obj
  })
}
export function bedRecord(bedId, patientId) {
  return request({
    url: '/icu/bedRecord/add',
    method: 'post',
    data: {
      bedId: bedId,
      patientId: patientId
    }
  })
}

export function addalready(obj) {
  return request({
    url: '/icu/device/add',
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

export function delwaiting(id) {
  return request({
    url: '/icu/hispatient/enrolledPatient',
    method: 'post',
    data: id
  })
}
export function operationBtn(id) {
  return request({
    url: '/icu/processrecord/selectPatient',
    method: 'post',
    data: {
      patientId: id
    }
  })
}
export function processAdd(obj) {
  return request({
    url: '/icu/processrecord/add',
    method: 'post',
    data: obj
  })
}

export function putObj(id, specificStepId) {
  return request({
    url: '/icu/processrecord/update',
    method: 'post',
    data: {
      id: id,
      specificStepId: specificStepId
    }
  })
}

export function remote(type) {
  return request({
    url: '/admin/dict/type/' + type,
    method: 'get'
  })
}
