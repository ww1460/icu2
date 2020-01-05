import request from '@/router/axios'
// 查询
export function fetchList(query) {
  return request({
    url: '/icu/knowWrit/page',
    method: 'get',
    params: query
  })
}

// 新增
export function addObj(obj) {
  return request({
    url: '/icu/knowWrit/add',
    method: 'post',
    data: obj
  })
}

// 删除

export function delObj(id) {
  return request({
    url: '/icu/knowWrit/' + id,
    method: 'delete'
  })
}

// 通过id查询
export function search(id) {
  return request({
    url: '/icu/knowWrit/' + id,
    method: 'get',
    params: id
  })
}

// 编辑、
export function editObj(obj) {
  return request({
    url: '/icu/knowWrit/update',
    method: 'post',
    data: obj
  })
}


// 根据code 查询 知情文书
export function informedDocuments(code) {
  return request({
    url: '/icu/knowWrit/getByCode/' + code,
    method: 'get',
  })
}

// 某患者新增知情文书
export function patientDocuments(obj) {
  return request({
    url: '/icu/knowWritLogs/add',
    method: 'post',
    data: obj
  })
}
// 某患者所签过的知情文书
export function patientSignatureDocuments(data) {
  return request({
    url: '/icu/knowWritLogs/page',
    method: 'get',
    params: data
  })
}
// 删除某患者所签过的知情文书
export function patientDelSignatureDocuments(data) {
  return request({
    url: '/icu/knowWritLogs/del',
    method: 'get',
    params: data
  })
}