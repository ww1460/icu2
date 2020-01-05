import request from '@/router/axios'

// 
export function queryProcess(obj) {
  return request({
    url: '/icu/processrecord/selectPatient',
    method: 'post',
    data: obj
  })
}
// 新增流程任务
export function addProcess(obj) {
    return request({
      url: '/icu/processrecord/add',
      method: 'post',
      data: obj
    })
  }

//   修改流程
export function upDateProcess(obj) {
    return request({
      url: '/icu/processrecord/update',
      method: 'post',
      data:obj
    })
  }