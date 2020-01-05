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

// 新增项目请求
export function getProject(query) {
  return request({
    url: '/icu/project/getTypeProject',
    method: 'post',
    params: query
  })
}
//点击查看

export function getViewData(code) {
  return request({
    url: '/icu/nursingTemplate/getCode/' + code ,
    method: 'get',
  })
}


//模板类型字典
export function getTemplateType() {
  return request({
    url: '/admin/dict/type/' + 'nurseing_template_type',
    method: 'get',
  })
}

//项目名称字典
export const getDict= () =>{
  return request({
    url: '/admin/dict/type/' + 'project_type',
    method: 'get',
  })
}

export function fetchList(query) {
  return request({
    url: '/icu/nursingTemplate/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/icu/nursingTemplate/add',
    method: 'post',
    data: obj
  })
}
export function addObjProject(obj) {
  return request({
    url: '/icu/nursingTemplate/save',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/icu/nursingTemplate/del/' + id,
    method: 'get',
  })
}


