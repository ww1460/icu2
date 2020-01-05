import request from '@/router/axios'

export function fetchList(query) {
   return request({
     url: '/icu/patpatient/departurePatient', 
     method: 'get',
     params: query
   })
 }

 
 export function dicData(type) {
   return request({
      url: '/admin/dict/type/' + type,
      method: 'get',
    })
 }