
import request from '@/router/axios'




//项目类型字典


// 新增项目请求
export function getProject() {
  return request({
    url: '/icu/templateSubTask/preJump',
    method: 'get',
  })
}
export function fetchList(query) {
  return request({
    url: '/icu/template/page',
    method: 'get',
    params: query
  })
}
export function getTem() {
  return request({
    url: '/icu/template/preJump',
    method: 'get',
  })
}


export function addObj(obj) {
  return request({
    url: '/icu/template/add',
    method: 'post',
    data: obj
  })
}
export function delObj(id) {
  return request({
    url: '/icu/template/' + id,
    method: 'delete',
   
  })
}

  export function putObj(obj) {
    return request({
      url: '/icu/template/update',
      method: 'post',
      data:obj   
    })
}

//查看
export function viewObj(id) {
  return request({
    url: '/icu/template/' + id,
    method: 'get',
  })
}
export const getDict= (type) =>{
  return request({
    url: '/admin/dict/type/' + type,
    method: 'get',
  })
}

export function getSubTask(id) {
  return request({
    url: '/icu/templateSubTask/taskTemplateId/' + id,
    method: 'get',
  })
}
export function addSubTask(query) {
  return request({
    url: '/icu/templateSubTask/add' ,
    method: 'post',
    data:query
  })
}
export function editSubTask(query) {
  return request({
    url: '/icu/templateSubTask/update' ,
    method: 'post',
    data:query
  })
}
export function delSubTask(id) {
  return request({
    url: '/icu/templateSubTask/'+id,
    method: 'delete',
  })
}

export function selectRepeat(sourceId) {
  return request({
    url: '/icu/template/sourceId/' +sourceId,
    method: 'get',
  })
}
// 任务模板新增前跳转
export function addPreJump() {
  return request({
    url: '/icu/template/preJump',
    method: 'get',
  })
}
