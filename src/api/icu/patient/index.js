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

export function fetchList(obj) {
   return request({
      url: '/icu/patpatient/inSciencePatient',
      method: 'get',
      params: obj
   })
}
// 获取患者
export function getnurse() {
   return request({
      url: '/icu/nursepatientcorrelation/patientInfo',
      method: 'get'
   })
}


export function delObj(id) {
   return request({
      url: '/icu/userecord/breakDevice' + id,
      method: 'post'
   })
}

export function deploy(id) {
   return request({
      url: '/act/model/deploy/' + id,
      method: 'post'
   })
}

export function addObj(obj) {
   return request({
      url: '/act/model/insert',
      method: 'post',
      data: obj
   })
}

// 根据id查询患者当前信息
export function getObj(id) {
   return request({
      url: '/icu/patpatient/' + id,
      method: 'get'
   })
}

export function putObj(obj) {
   return request({
      url: '/admin/log/',
      method: 'put',
      data: obj
   })
}


// icu_departure
// icu出科类型
export function departure(type) {
   return request({
      url: '/admin/dict/type/' + type,
      method: 'get',
   })
}

// 科室
export function getsection() {
   return request({
      url: '/admin/dept/AllDept',
      method: 'get',
   })
}
//  export function departure(type) {
//    return request({
//      url: '/admin/dict/type/' + type,
//      method: 'get',
//    })
//  }