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

export function fetchList(query) {
  return request({
    url: '/icu/nurse/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/icu/nurse/add',
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
    url: '/icu/nurse/del',
    method: 'post',
    data: {
      nurseId: id
    }
  })
}

export function putObj(id) {
  return request({
    url: '/icu/nurse/getById',
    method: 'post',
    data: {
      nurseId: id
    }

  })
}
export function UpdateObj(obj) {
  return request({
    url: '/icu/nurse/update',
    method: 'post',
    data: obj

  })
}
export function depPatient() {
  return request({
    url: '/icu/task/preJump',
    method: 'get'

  })
}

export function getsection() {
  return request({
    url: '/admin/dept/AllDept',
    method: 'get'
  })
}

export function pharmacyIp (E) {
  return request({
    url: '/icu/pharmacy/ip',
    method: 'get',
    params: {
      type: E
    }
  })
}

// 验证用户名存不存在

export function updateUsername (username) {
  return request({
    url: '/admin/user/details/' + username,
    method: 'get'
  })
}

// 字典表

export function getGrade () {
  return request({
    url: '/admin/dict/type/' + 'nurse_grade',
    method: 'get'
  })
}
