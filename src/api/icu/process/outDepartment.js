import request from '@/router/axios'

export function fetchwaiting(query) {
  return request({
    url: '/icu/patpatient/inSciencePatientPage',
    method: 'get',
    params: query
  })
}
export function fetchalready(query) {
  return request({
    url: '/icu/patpatient/timeSelectDeparturePatient',
    method: 'get',
    params: query
  })
}
export function operationBtn(flowName, id) {
  return request({
    url: '/icu/processrecord/selectPatient',
    method: 'post',
    data: {
      flowName: flowName,
      patientId: id
    }
  })
}
export function patientId_entryState() {
  return request({
    url: '/admin/dict/type/patientId_entryState',
    method: 'get'
  })
}

export function processAdd(flowName, obj) {
  return request({
    url: '/icu/processrecord/add',
    method: 'post',
    data: {
      flowName: flowName,
      patientId: obj
    }
  })
}
export function stopDoctorsAndTask(patientId) {
  return request({
    url: '/icu/patpatient/stopDoctorsAndTask/' + patientId,
    method: 'get'
  })
}
export function stopDeviceAndPiping(patientId) {
  return request({
    url: '/icu/patpatient/stopDeviceAndPiping/' + patientId,
    method: 'get'
  })
}
export function stopNursAndPatient(obj) {
  return request({
    url: '/icu/patpatient/stopNursAndPatient',
    method: 'post',
    data: obj
  })
}

export function patientDepartureType() {
  return request({
    url: '/icu/patpatient/patientDepartureType',
    method: 'get'
  })
}
export function delObj(id) {
  return request({
    url: '/icu/processrecord/' + id,
    method: 'delete'
  })
}
export function remote(type) {
  return request({
    url: '/admin/dict/type/' + type,
    method: 'get'
  })
}


export function putObj(flowName, id, specificStepId) {
  return request({
    url: '/icu/processrecord/update',
    method: 'post',
    data: {
      flowName: flowName,
      id: id,
      specificStepId: specificStepId
    }
  })
}

export function departureMiddle(obj) {
  return request({
    url: '/icu/patpatient/departureMiddle/' + obj,
    method: 'get'
  })
}
