

import request from '@/router/axios'

export function addNurseRecord(id) {
  return request({
    url: '/icu/pressureSore/recorder/preJump',
    method: 'get',
    params: id
  })
}


export function recordDic(type) {
  return request({
    url: '/admin/dict/type/' + type,
    method: 'get',
  })
}



export function addRecord(obj) {
  return request({
    url: '/icu/pressureSore/recorder/add',
    method: 'post',
    data: obj
  })
}

export function query(obj) {
  return request({
    url: '/icu/pressureSore/recorder/page',
    method: 'get',
    params: obj
  })
}
