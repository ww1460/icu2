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
    url: '/icu/patientConstraint/page',
    method: 'get',
    params: query
  })
}

// 查询
export function inquire(id) {
  return request({
    url: '/icu/patientConstraint/' + id,
    method: 'get',
  })
}

export function addObj(obj) {
  return request({
    url: '/icu/patientConstraint/add',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: 'icu/patientConstraint/getById' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/icu/patientConstraint/del/' + id,
    method: 'get',
  })
}

export function putObj(id) {
  return request({
    url: '/icu/patientConstraint/getById',
    method: 'post',
    data:{
      nurseId :id
    }
    
  })
}
  export function UpdateObj(obj) {
    return request({
      url: '/icu/patientConstraint/update',
      method: 'post',
      data:obj
      
    })
  }

  export function getNursList() {
    return request({
      url: '/icu/nurse/getDeptAllNurse',
      method: 'post',
    })
  }
