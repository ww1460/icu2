

import request from '@/router/axios'

// 数据回填查询

export function query(data) {
  return request({
    url: '/icu/inevitablePressureSore/page',
    method: 'get',
    params: data
  })
}

// 新增前跳转页面
export function addJump(data) {
  return request({
    url: '/icu/inevitablePressureSore/preJump',
    method: 'get',
    params: data
  })
}


// 字典表
export function preDic(dicurl) {
    return request({
      url: '/admin/dict/type/' + dicurl,
      method: 'get',
    })
  }

// 提交难免压疮
export function subForm(obj) {
  return request({
    url: '/icu/inevitablePressureSore/add',
    method: 'post',
    data: obj
  })
}

// 评估分数

export function getScore(data) {
  return request({
    url: '/icu/assessRecord/getMapData',
    method: 'get',
    params: data
  })
}


// 采取适当防范措施
export function pMea(data) {
  return request({
    url: '/icu/templateSubTask/pressureSore',
    method: 'post',
    data: data
  })
}
// 点击某项任务
export function queryTask(data) {
  return request({
    url: '/icu/templateSubTask/templateProjectValue',
    method: 'post',
    data: data
  })
}

export function addTask(obj) {
   return request({
     url: '/icu/templateSubTask/addTask',
     method: 'post',
     data: obj
   })
 }