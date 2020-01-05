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

export function getBedlist() {
  return request({
    url: '/icu/hospitalBed/getDeptBed',
    method: 'post',
    data:{
      delflag:0
    }
  })
}

export function getMatronInfo() {
    return request({
      url: '/icu/nurse/nurseInfo',
      method: 'post',
    })
}

export function getNurseInfo() {
    return request({
      url: '/icu/nurse/getDeptNurse',
      method: 'post',
    })
}


export function getNurse_patient(id) {
  return request({
    url: 'icu/nursepatientcorrelation/selectPatient',
    method: 'get',
    params:{
      patientId:id
    }
  })
}

export function get_warning(query) {
  return request({
    url: 'icu/projectWarm/page',
    method: 'get',
    params: query
  })
}


export function get_taskWarning() {
  return request({
    url: 'icu/earlywarning/page',
    method: 'get',
  })
}