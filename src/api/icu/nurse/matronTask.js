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

// 医嘱查询任务
export function doctorOrderQueryTask(id) {
   return request({
     url: '/icu/task/getTaskId/' + id,
     method: 'get',
   //   params: data
   })
 }


export function fetchInfo(query) {
  return request({
    url: '/icu/nurse/nurseInfo',
    method: 'post',
    params: query
  })
}
export function fetchList(query) {
  return request({
    url: '/icu/subtask/page',
    method: 'get',
    params: query
  })
}
export function matronFetch(query) {
  return request({
    url: '/icu/task/selectPaging',
    method: 'get',
    params: query
  })
}


export function addObj(obj) {
  return request({
    url: '/icu/task/add',
    method: 'post',
    data: obj
  })
}export function getTaskTemplate() {
  return request({
    url: '/icu/template/selectAll',
    method: 'get'
  })
}



export function getObj(id) {
  return request({
    url: '/admin/tenant/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/icu/task/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/icu/task/update',
    method: 'post',
    data: obj
  })
}
export function putState(obj) {
  return request({
    url: '/icu/task/updateState',
    method: 'post',
    data: obj
  })
}
export function putAll(obj) {
  return request({
    url: '/icu/task/wholeReceive',
    method: 'post',
    data: obj
  })
}
// 多条任务新增 短期任务
export function addTasks(obj) {
  return request({
    url: '/icu/task/inserts',
    method: 'post',
    data: obj
  })
}
//长期任务

export function addTiming(obj) {
  return request({
    url: '/icu/timingexecution/updateList',
    method: 'post',
    data: obj
  })
}

export function patAssNurse(obj) {
  return request({
    url: '/icu/nursepatientcorrelation/selectPatient',
    method: 'get',
    params: obj
  })
}
export function getProject(obj) {
  return request({
    url: '/icu/project/getTypeProject',
    method: 'post',
    data: obj
  })
}
export const getDict= () =>{
  return request({
    url: '/admin/dict/type/' + 'project_type',
    method: 'get'
  })
}
export function selectProjectValue(obj) {
  return request({
    url: '/icu/task/selectProjectValue',
    method: 'post',
    data: obj
  })
}
export function getNurse() {
  return request({
    url: '/icu/task/taskEntrustNurse',
    method: 'get'
  })
}
export function taskEntrust(obj) {
  return request({
    url: '/icu/task/taskEntrust',
    method: 'post',
    data: obj
  })
}
export function assistNurse(obj) {
  return request({
    url: '/icu/task/assistNurse',
    method: 'post',
    data: obj
  })
}
export function getDetails(id) {
  return request({
    url: '/icu/task/taskIdDetails/' + id,
    method: 'get' 
  })
}
export const getState= () =>{
  return request({
    url: '/admin/dict/type/' + 'task_state',
    method: 'get'
  })
}