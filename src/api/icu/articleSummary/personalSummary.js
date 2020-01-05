import request from '@/router/axios'
// 全部文章
export function allFetchList(query) {
   return request({
      url: '/icu/personalsummary/page',
      method: 'get',
      params: query
   })
}
// 个人文章
export function preFetchList(query) {
   return request({
      url: '/icu/personalsummary/selectPersonal',
      method: 'get',
      params: query
   })
}
// 收藏文章
export function ectFetchList(query) {
   return request({
      url: '/icu/personalsummary/selectCollect',
      method: 'get',
      params: query
   })
}
//项目名称字典
export const getDict= () =>{
   return request({
     url: '/admin/dict/type/' + 'category_type',
     method: 'get',
   })
 }

export function delObj(id) {
   return request({
      url: '/icu/personalsummary/' + id,
      method: 'delete'
   })
}

export function addObj(obj) {
   return request({
      url: '/icu/personalsummary/add',
      method: 'post',
      data: obj
   })
}


export function editObj(obj) {
   return request({
      url: '/icu/personalsummary/updateSummary',
      method: 'put',
      data: obj
   })
}


export function joinObj(obj) {
   return request({
      url: '/icu/nursecollect/collect',
      method: 'post',
      data: obj
   })
}

// export function closejoinObj(row) {
//    return request({
//       url: '/icu/nursecollect/' + row.id,
//       method: 'delete',
//    })
// }