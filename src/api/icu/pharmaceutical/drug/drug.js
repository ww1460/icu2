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
//初始化
export function fetchList(query) {
  return request({
    url: '/icu/medicationError/page',
    method: 'get',
    params: query
  })
}

//新增
export function addObj(obj) {
  return request({
    url: '/icu/medicationError/add',
    method: 'post',
    data:obj
  })
}

//查询
export function getObj(id) {
  return request({
    url: 'icu/medicationError/' + id,
    method: 'get'
  })
}
//修改
export function UpdateObj(obj) {
  return request({
    url: '/icu/medicationError/update',
    method: 'post',
    data:obj
    
  })
}

//删除
export function delObj(id) {
  return request({
    url: '/icu/medicationError/del/' + id,
    method: 'get'
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
  
    export function depPatient() {
      return request({
        url: '/icu/task/preJump',
        method: 'get',
        
      })
    }

    export function getdictionaries() {
      return request({
        url: '/admin/dict/type/' + 'pharmacy_error_level',
        method: 'get',
        
      })
    }

   