
import request from '@/router/axios'

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

export function addObj(obj) {
  return request({
    url: '/icu/subtask/add',
    method: 'post',
    data: obj
  })
}
export function getTaskTemplate() {
  return request({
    url: '/icu/templateSubTask/buildByOneself',
    method: 'post',
    data:{

    }
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
    url: '/icu/subtask/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/icu/subtask/update',
    method: 'post',
    data: obj
  })
}
export function putState(obj) {
  return request({
    url: '/icu/subtask/updateState',
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
    url: '/icu/subtask/nursingScheme',
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
    method: 'get',
  })
}
export const getasktType= () =>{
  return request({
    url: '/admin/dict/type/' + 'task_taskType',
    method: 'get',
  })
}
export function selectProjectValue(obj) {
  return request({
    url: '/icu/subtask/selectProjectValue',
    method: 'post',
    data: obj
  })
}
export function getNurse() {
  return request({
    url: '/icu/subtask/taskEntrustNurse',
    method: 'get',
  })
}
export function breakUp(obj) {
  return request({
    url: '/icu/subtask/taskSubTaskSplit',
    method: 'post',
    data:obj
  })
}

export function taskEntrust(obj) {
  return request({
    url: '/icu/subtask/taskEntrust',
    method: 'post',
    data: obj
  })
}
export function assistNurse(obj) {
  return request({
    url: '/icu/subtask/assistNurse',
    method: 'post',
    data: obj
  })
}
export function getDetails(id) {
  return request({
    url: '/icu/subtask/getDetails/'+id,
    method: 'get',
  
  })
}
export const getState= () =>{
  return request({
    url: '/admin/dict/type/' + 'task_state',
    method: 'get',
  })
}
export function getRapidTask() {
  return request({
    url: '/icu/templateSubTask/buildByOneself',
    method: 'post',
    data:{

    }
  })
}
export function getTemplateProjectValue(obj) {
  return request({
    url: '/icu/templateSubTask/templateProjectValue',
    method: 'post',
    data:obj
  })
}
export function postInsertTemplate(obj) {
  return request({
    url: '/icu/templateSubTask/addTask',
    method: 'post',
    data:obj
  })
}
//新增时请求任务模板
export function getTemplate() {
  return request({
    url: '/icu/template/selectTaskPreJump',
    method: 'post',
    data:{

    }
  })
}
//预定护理计划选择主模板展示子模板
export function getSubTask(id) {
  return request({
    url: '/icu/templateSubTask/taskTemplateId/' + id,
    method: 'get',
  })
}