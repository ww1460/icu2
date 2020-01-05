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
      url: '/icu/intakeRecord/page',
      method: 'get',
      params: query
   })
}

export function addObj(obj) {
   return request({
      url: '/icu/intakeRecord',
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
      method: 'get',

   })
}

// 获取某一类型的项目
//  {projectType}
export function getProjectType(id) {
   return request({
      url: '/icu/project/getOneTypeProject/' + id,
      method: 'get',
   })
}
//  获取护士下患者信息
export function getnurse() {
   return request({
      url: '/icu/nursepatientcorrelation/patientInfo',
      method: 'get'
   })
}

// 新增出入量
export function addProjectType(obj) {
   return request({
      url: '/icu/intakeRecord/add',
      method: 'post',
      data:obj
   })
}
export function fetchLists(obj) {
  return request({
    url: '/icu/intakeRecord/getReport',
    method: 'post',
    data:obj
  })
}

//获取图表数据
// export function getEchart(id) {
//   return request({
//     url: '/icu/projectRecord/getVitals/' + id,
//     method: 'get'
//   })
// }
// export function getEcharts(id) {
//   return request({
//     url: '/icu/intakeOutputRecord/getMapData/' + id,
//     method: 'get'
//   })
// }

export function getEcharts(obj) {
   return request({
     url: '/icu/intakeRecord/getMapData',
     method: 'post',
     data:obj
   })
 }