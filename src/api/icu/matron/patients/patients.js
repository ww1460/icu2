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

//建议提交

export function SubCheck(obj) {
    return request({
        url: '/icu/projectAdviceCorrelation/addAndUpdate',
        method: 'post',
        data:obj
    })
}

//点击建议
export function getCheck(obj) {
    return request({
        url: '/icu/illnessAdvice/getAdvice',
        method: 'post',
        data:obj
    })
}

//项目删除
export function delProject(id) {
    return request({
        url: '/icu/illnessProject/del/' + id,
        method: 'get',
    })
}

//修改护理项
export function putNursing(obj) {
    return request({
        url: '/icu/illnessAdvice/update',
        method: 'post',
        data:obj
    })
}

//删除护理项
export function delNursing(id) {
    return request({
        url: '/icu/illnessAdvice/del/' + id,
        method: 'get',
    })
}

//新增护理项
export function addNursing(obj) {
    return request({
        url: '/icu/illnessAdvice/add',
        method: 'post',
        data:obj
    })
}

//点击护理项
export function getNursing(illnessProjectId) {
    return request({
        url: '/icu/illnessAdvice/getByProject/' + illnessProjectId,
        method: 'get'
    })
}

//第二层删除
// /illnessNursingState/delProject 

//第三层修改
export function putObj(obj) {
    return request({
        url: '/icu/illnessNursingState/update',
        method: 'post',
        data:obj
    })
}

//第三层删除
export function delObj(id) {
    return request({
        url: '/icu/illnessNursingState/del/' + id,
        method: 'get',
    })
}
//第三层新增
export function addObj(obj) {
    return request({
        url: '/icu/illnessNursingState/add',
        method: 'post',
        data:obj
    })
}

//第二层查看
export function getItem(illnessProjectId) {
    return request({
        url: '/icu/illnessNursingState/getProjectState/' + illnessProjectId,
        method: 'get',
    })
}

//第二层管理 保存

export function SubProject(obj) {
    return request({
        url: '/icu/illnessProject/add',
        method: 'post',
        data:obj
    })
}

//第一层字典表 初始化查询
export function fetchList() {
    return request({
        url: '/admin/dict/type/' + 'illness_nursing_type',
        method: 'get',

    })
}
export function createdList() {
    return request({
        url: '/admin/dict/type/' + 'project_type',
        method: 'get',

    })
}

//第一层点击查看
export function viewObj(illnessNursingTypeFlag) {
    return request({
        url: '/icu/illnessProject/type/' + illnessNursingTypeFlag,
        method: 'get',
    })
}

//第二层点击管理
export function getProject(illnessNursingTypeFlag) {
    return request({
        url: '/icu/illnessProject/project/' + illnessNursingTypeFlag,
        method: 'get',
    })
}