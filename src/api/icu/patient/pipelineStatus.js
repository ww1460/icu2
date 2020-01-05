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

// 已连接
export function connected(obj) {
  return request({
    url: '/icu/pinping/userecord/selectInConnected',
    method: 'post',
    data: obj
  })
}

// 未连接
export function unconnected(query) {
  return request({
    url: '/icu/piping/page',
    method: 'get',
    data: query
  })
}
// 已使用
export function used(query) {
  return request({
    url: '/icu/pinping/userecord/selectUsedAll',
    method: 'get',
    params: query
  })
}
// 拔管
export function drawing(query) {
  return request({
    url: '/icu/pinping/userecord/breakPiping',
    method: 'post',
    data: query
  })
}




// 开启
export function open(obj) {
  return request({
    url: '/icu/pinping/userecord/add',
    method: 'post',
    data: obj
  })
}

export function openJump(type) {
  return request({
    url: '/admin/dict/type/' + type,
    method: 'get',
  })
}

// uex登记表
export function uexOpen(id) {
  return request({
    url: '/icu/slippageregistersurface/preJump',
    method: 'get',
    params: id
  })
}
// uex登记表数据回填
export function slippagDataBack(data) {
   return request({
     url: '/icu/slippageregistersurface/preJump',
     method: 'get',
     params: data
   })
 }
// 字典表
export function uexDic(dicurl) {
  return request({
    url: '/admin/dict/type/' + dicurl,
    method: 'get',
  })
}


// uex登记表提交
export function uexSub(obj) {
  return request({
    url: '/icu/slippageregistersurface/add',
    method: 'post',
    data: obj
  })
}
// uex修改提交
export function putObj(obj) {
   return request({
      url: '/icu/slippageregistersurface/update',
      method: 'post',
      data: obj
   })
}



// 导管评分

export function catheterScore(data) {
  return request({
    url: '/icu/assessType/getAssess',
    method: 'get',
    params: data
  })
}

// 提交导管评分
export function subAdd(obj) {
  return request({
    url: '/icu/assessProjectRecord/add',
    method: 'post',
    data: obj
  })
}


// 滑脱风险新增前跳转页面
export function slippageJump(obj) {
  return request({
    url: '/icu/nursing/preJump',
    method: 'get',
    params: obj
  })
}



// 评估结果
export function resultSlippage(data) {
  return request({
    url: '/icu/assessRecord/getMapData',
    method: 'get',
    params: data
  })
}


// 管道护理

export function pipNursingPage(data) {
   return request({
     url: '/icu/nursing/page',
     method: 'get',
     params: data
   })
 }
 export function addSlippage(obj) {
   return request({
     url: '/icu/nursing/add',
     method: 'post',
     data: obj
   })
 }