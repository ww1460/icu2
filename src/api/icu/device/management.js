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
export function pharmacyIp(E) {
  return request({
    url: '/icu/pharmacy/ip',
    method: 'get',
    params: {
      type: E
    }
  })
}

export function parameters(query) {
  return request({
    url: '/icu/parameters/parameters',
    method: 'get',
    params: {
      devModel: query
    }
  })
}

export function projectType(query) {
  return request({
    url: '/admin/dict/type/project_type',
    method: 'get',
    params: {
      devModel: query
    }
  })
}
export function parametersAdd(obj) {
  return request({
    url: '/icu/parameters/add',
    method: 'post',
    data: obj
  })
}
export function parametersUpdate(obj) {
  return request({
    url: '/icu/parameters/update',
    method: 'post',
    data: obj
  })
}
export function delParameters(id) {
  return request({
    url: '/icu/parameters/' + id,
    method: 'delete'
  })
}
export function getProject(obj) {
  return request({
    url: '/icu/project/getTypeProject',
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

