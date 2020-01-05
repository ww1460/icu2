

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/icu/drainage/page',
    method: 'get',
    params: query
  })
}
export function preJump(obj) {
  return request({
    url: '/icu/drainageattribute/preJump',
    method: 'get',
    params: obj
  })
}

export function addObj(obj) {
  return request({
    url: '/icu/drainage/add',
    method: 'post',
    data: obj
  })
}

export function addattribute(form, drainageId) {
  return request({
    url: '/icu/drainageattribute/add',
    method: 'post',
    data: {
      drainageId: drainageId,
      attributeName: form.value,
      attributeType: form.value1,
      normal: form.normal,
      measures: form.desc
    }
  })
}
export function dictionary() {
  return request({
    url: '/admin/dict/type/drainage_attribute',
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/icu/drainage/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/icu/drainage/update',
    method: 'post',
    data: obj
  })
}


export function fetchListAttribute(query) {
  return request({
    url: '/icu/drainageattribute/drainageId/' + query,
    method: 'get'
  })
}
export function addObjAttribute(obj) {
  return request({
    url: '/icu/drainage/add',
    method: 'post',
    data: obj
  })
}

export function getObjAttribute(id) {
  return request({
    url: '/admin/dict/' + id,
    method: 'get'
  })
}

export function delObjAttribute(row) {
  return request({
    url: '/icu/drainageattribute/' + row.id,
    method: 'delete'
  })
}

export function putObjAttribute(obj) {
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
