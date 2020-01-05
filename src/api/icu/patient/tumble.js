import request from '@/router/axios'

export function getAssess(query) {
  return request({
    url: '/icu/assessType/getAssess',
    method: 'get',
    params: query
  })
}

//新建流程

export function getFlow(obj) {
  return request({
    url: '/icu/processrecord/selectPatient',
    method: 'post',
    data: obj
  })
}

export function addFlow(obj) {
  return request({
    url: '/icu/processrecord/add',
    method: 'post',
    data: obj
  })
}

export function putflow(obj) {
  return request({
    url: '/icu/processrecord/update',
    method: 'post',
    data: obj
  })
}



export function addObj(obj) {
  return request({
    url: '/icu/nursingRecord/windowsEnter',
    method: 'post',
    data: obj
  })
}

export function getTemplatelist() {
  return request({
    url: '/icu/templateSubTask/fallIntoBed',
    method: 'get'
  })
}

export function templateProjectValue(obj) {
  return request({
    url: '/icu/templateSubTask/templateProjectValue',
    method: 'post',
    data: obj
  })
}

export function addTask(obj) {
  return request({
    url: '/icu/templateSubTask/addTask',
    method: 'post',
    data: obj
  })
}
