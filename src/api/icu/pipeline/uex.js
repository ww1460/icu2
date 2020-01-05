import request from '@/router/axios'

// 查询患者
export function getnurse() {
   return request({
      url: '/icu/nursepatientcorrelation/patientInfo',
      method: 'get'
   })
}
// 根据患者id查询uex登记表
export function fetchList(query) {
   return request({
      url: '/icu/slippageregistersurface/page',
      method: 'get',
      params: query
   })
}
// uex导管类型
export function slippag() {
   return request({
      url: '/icu/piping/all',
      method: 'get',
   })
}

// 字典表
export function uexDic(dicurl) {
   return request({
      url: '/admin/dict/type/' + dicurl,
      method: 'get',
   })
}



export function delObj(id) {
   return request({
      url: '/icu/slippageregistersurface/' + id,
      method: 'delete'
   })
}

export function putObj(obj) {
   return request({
      url: '/icu/slippageregistersurface/update',
      method: 'post',
      data: obj
   })
}
