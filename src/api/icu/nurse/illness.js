import request from '@/router/axios'

export function illnessNursingState(id) {
  return request({
    url: '/icu/illnessNursingState/getIllnessTree/' + id,
    method: 'get',
  })
}


export function getType() {
  return request({
      url: '/admin/dict/type/' + 'illness_nursing_type',
      method: 'get',

  })
}

//点击提交数据
export function subData(obj) {
  return request({
      url: '/icu/nursingRecord/Illness',
      method: 'post',
      data:obj
  })
}


export function getfixedValue(id) {
  return request({
      url: '/icu/projectRecordValue/getByProject/' + id,
      method: 'get',
  })
}
