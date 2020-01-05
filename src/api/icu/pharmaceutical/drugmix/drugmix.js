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
    url: '/icu/easilyConfusedCatalog/page',
    method: 'get',
    params: query
  })
}


//外层新增提交
export function addObj(obj) {
  return request({
    url: '/icu/easilyConfusedCatalog/add',
    method: 'post',
    data: obj
  })
}

//外层删除

export function outerObj(id) {
  return request({
    url: '/icu/easilyConfusedCatalog/' + id,
    method: 'delete',
  
  })
}
//内层删除

export function delObj(id) {
    return request({
      url: '/icu/easilyConfusedParticular/' + id,
      method: 'delete',
    
    })
  }
//内层新增提交

export function singleObj(obj) {
  return request({
    url: 'icu/easilyConfusedParticular/add',
    method: 'post',
    data: obj
  })
}
//内层修改
export function singleUpdate(obj) {
  return request({
    url: 'icu/easilyConfusedParticular',
    method: 'put',
    data: obj
  })
}
//外层