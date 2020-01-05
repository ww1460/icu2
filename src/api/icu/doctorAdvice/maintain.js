import request from '@/router/axios'

// 医嘱
export function fetchList(data) {
   return request({
      url: '/icu/doctorsadvicecode/page',
      method: 'get',
      params: data
   })
}
//新增
export function addObj(obj) {
    return request({
       url: '/icu/doctorsadvicecode/add',
       method: 'post',
        data:obj
    })
 }

 //删除
 export function delObj(id) {
    return request({
       url: '/icu/doctorsadvicecode/' + id,
       method: 'delete',
    })
 }

 //修改
 export function putObj(obj) {
    return request({
       url: '/icu/doctorsadvicecode/update',
       method: 'post',
       data:obj
    })
 }
