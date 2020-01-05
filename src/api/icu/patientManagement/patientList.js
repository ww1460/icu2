import request from '@/router/axios'

export function fetchList(query) {
   return request({
     url: '/icu/patpatient/selectPaging', 
     method: 'get',
     params: query
   })
 }

export function addObj(obj) {
   return request({
     url: '/icu/patpatient/add',
     method: 'post',
     data: obj
   })
 }


 export function delObj(id) {
   return request({
     url: '/icu/patpatient/' + id,
     method: 'delete'
   })
 }
 
 export function putObj(obj) {
   return request({
     url: '/icu/patpatient',
     method: 'put',
     data: obj
   })
 }