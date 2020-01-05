/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

import request from '@/router/axios'

// 获取医嘱
export function addPreJump() {
    return request({
      url: '/icu/template/preJump',
      method: 'get',
    })
  }
  //获取护士
  export function getNurse() {
    return request({
      url: '/icu/subtask/taskEntrustNurse',
      method: 'get',
    })
  }
export function fetchList(query) {
  return request({
    url: '/icu/retrospect/page',
    method: 'get',
    params: query
  })
}
export function addObj(obj) {
  return request({
    url: '/icu/retrospect/addRetrospect',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: 'icu/nurse/getById' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/icu/retrospect/' + id,
    method: 'delete',
  })
}

  export function UpdateObj(obj) {
    return request({
      url: '/icu/retrospect/updateRetrospect',
      method: 'put',
      data:obj
      
    })
  }

