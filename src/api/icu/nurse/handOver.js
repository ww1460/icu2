import request from '@/router/axios'

export function getPat(query) {
  return request({
    url: '/icu/changeshiftsrecord/preJump',
    method: 'get',
    params: query
  })
}

// 获取负责患者和任务
export function getShiftsTask(query) {
  return request({
    url: '/icu/changeshiftsrecord/shiftsTask',
    method: 'get',
    params: query
  })
}
export function getRecords(obj) {
  return request({
    url: '/icu/nursingRecord/page',
    method: 'get',
    params:obj
  })
}

//点击保存交班描述
export function saveDescribe(obj) {
  return request({
    url: '/icu/changeshiftsrecord/keepRecords',
    method: 'post',
    data: obj
  })
}

export function shifts(obj) {
  return request({
    url: '/icu/changeshiftsrecord/clickShifts',
    method: 'post',
    data: obj
    
    
  })
}
