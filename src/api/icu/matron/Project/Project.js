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

export function warmJudgeAdd(obj) {
  return request({
    url: '/icu/warmJudge/add', 
    method: 'post',
    data:obj
   
  })
}

export function Warning(id) {
  return request({
    url: '/icu/warmJudge/getProjectWarm/' + id, 
    method: 'get',
   
  })
}
export function getFixd(id) {
  return request({
    url: '/icu/projectRecordValue/getByProject/' + id, 
    method: 'get',
   
  })
}
export function addFixd(obj) {
  return request({
    url: '/icu/projectRecordValue/add',
    method: 'post',
    data: obj
  })
}
export function delFixd(id) {
  return request({
    url: '/icu/projectRecordValue/del/'+id, 
    method: 'get',
  })
}
export function editFixd(obj) {
  return request({
    url: '/icu/projectRecordValue/update',
    method: 'post',
    data: obj
  })
}
export function delWarm(id) {
  return request({
    url: '/icu/projectWarm/del'+id,
    method: 'delete',
  })
}

export function fetchList(query) {
  return request({
    url: '/icu/project/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/icu/project/add',
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
    url: '/icu/project/' + id,
    method: 'delete',
  
  })
}

export function putObj(id) {
  return request({
    url: '/icu/nurse/getById',
    method: 'post',
    data:{
      nurseId :id
    }
    
  })
}
  export function UpdateObj(obj) {
    return request({
      url: '/icu/project/update',
      method: 'post',
      data:obj
      
    })
}
