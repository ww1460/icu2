import request from '@/router/axios'
// 查询患者
export function getnurse() {
   return request({
      url: '/icu/nursepatientcorrelation/patientInfo',
      method: 'get'
   })
}

// 医嘱
export function fetchList(data) {
   return request({
      url: '/icu/doctorsadvic/loginNurseDoctorsAdvice',
      method: 'get',
      params: data
   })
}
// 新增前患者信息
export function addInfo(data) {
   return request({
      url: '/icu/adversedrugreactionsrecord/preJump',
      method: 'get',
      params: data
   })
}
// 新增不良反应
export function addDrug(obj) {
   return request({
      url: '/icu/adversedrugreactionsrecord/add',
      method: 'post',
      data: obj
   })
}


//修改
export function upData(obj) {
   return request({
      url: '/icu/doctorsadvic/update',
      method: 'post',
      data: obj
   })
}
// 查询医嘱任务
export function doctorOrders(data) {
   return request({
      url: '/icu/doctorsadvic/' + data,
      method: 'get',
   })
}

// 医嘱项目表
export function project(data) {
   return request({
      url: '/icu/doctorsadvicedictionaries/page',
      method: 'get',
      params: data
   })
}

// 新增医嘱项目表
export function addProject(obj) {
   return request({
      url: '/icu/doctorsadvicedictionaries/add',
      method: 'post',
      data: obj
   })
}
// 删除
export function delProject(id) {
   return request({
      url: '/icu/doctorsadvicedictionaries/' + id,
      method: 'delete',
   })
}
// 编辑
export function editProject(obj) {
   return request({
      url: '/icu/doctorsadvicedictionaries/update',
      method: 'post',
      data: obj
   })
}