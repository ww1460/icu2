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

export function fetchList(nursingReportFlag) {
  return request({
    url: '/icu/projectCorrelation/getProjectCorrelation/' + nursingReportFlag ,
    method: 'get',
  })
}

export function updateShowDate(obj) {
  return request({
    url: '/icu/projectCorrelation/update' ,
    method: 'post',
    data:obj
  })
}

export function getProject() {
    return request({
      url: '/icu/project/getTypeProject' ,
      method: 'post',
    })
  }
  export function addProject(obj) {
    return request({
      url: '/icu/projectCorrelation/save' ,
      method: 'post',
      data:obj
    })
  }
  
  export const getDict= () =>{
    return request({
      url: '/admin/dict/type/' + 'project_type',
      method: 'get',
    })
  }

  export function addSort(obj) {
    return request({
      url: '/icu/projectCorrelation/updateBatch' ,
      method: 'post',
      data:obj
    })
  }
  export function delObj(id) {
    return request({
      url: '/icu/projectCorrelation/del/' + id ,
      method: 'get',
    })
  }