


import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/icu/project/page',
    method: 'get',
    params:query
  })
}
export function getAssessTree(projectId) {
    return request({
      url: '/icu/assessType/getAssessTree/'+projectId,
      method: 'get',
    
    })
  }

export function addListName(obj) {
  return request({
    url: '/icu/project/add',
    method: 'post',
    data: obj
  })
}
export function updateListName(obj) {
    return request({
      url: '/icu/project/update',
      method: 'post',
      data: obj
    })
  }
  export function delListName(id) {
    return request({
      url: '/icu/project/' + id,
      method: 'delete'
    })
  }
  
  export function addType(obj) {
    return request({
      url: '/icu/assessType/add',
      method: 'post',
      data: obj
    })
  }



export function delObj(id) {
  return request({
    url: '/icu/assessType/del/' + id,
    method: 'get'
  })
}
export function delPro(id) {
  return request({
    url: '/icu/assessProject/del/' + id,
    method: 'get'
  })
}


export function addPro(obj) {
  return request({
    url: '/icu/assessProject/add',
    method: 'post',
    data: obj
  })
}

export function delCond(id) {
  return request({
    url: '/icu/assessCondition/del/' + id,
    method: 'get'
  })
}
export function addCond(obj) {
  return request({
    url: '/icu//assessCondition/add',
    method: 'post',
    data: obj
  })
}



// export function delObj(id) {
//   return request({
//     url: '/admin/tenant/' + id,
//     method: 'delete'
//   })
// }

export function updateType(obj) {
  return request({
    url: '/icu/assessType/update',
    method: 'post',
    data: obj
  })
}

export function updatePro(obj) {
  return request({
    url: '/icu/assessProject/update',
    method: 'post',
    data: obj
  })
}

export function updateCond(obj) {
  return request({
    url: '/icu/assessCondition/update',
    method: 'post',
    data: obj
  })
}
