import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/icu/piping/selectPaging',
    method: 'get',
    params: query
  })
}
export function preJump(query) {
  return request({
    url: '/icu/piping/preJump',
    method: 'post',
    data: query
  })
}
export function pipingRisklevel() {
  return request({
    url: '/admin/dict/type/' + 'piping_risklevel',
    method: 'get'
  })
}


export function addObj(form) {
  return request({
    url: '/icu/piping/add',
    method: 'post',
    data: {
      pipingName: form.pipingName,
      pipingType: form.pipingType,
      state: form.state,
      risklevel: form.risklevel,
      dateOfStorage: form.dateOfStorage,
      inDate: form.inDate,
      manufacturer: form.manufacturer,
      drainageId: form.drainageId
    }
  })
}

export function getObj(id) {
  return request({
    url: '/admin/dict/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/icu/piping/' + row.id,
    method: 'delete'
  })
}

export function putObj(formEdit) {
  return request({
    url: '/icu/piping/update',
    method: 'post',
    data: {
      pipingName: formEdit.pipingName,
      pipingType: formEdit.pipingType,
      state: formEdit.state,
      risklevel: formEdit.risklevel,
      dateOfStorage: formEdit.dateOfStorage,
      inDate: formEdit.inDate,
      manufacturer: formEdit.manufacturer,
      drainageId: formEdit.drainageId,
      id: formEdit.id
    }
  })
}

export function remote(id) {
  return request({
    url: '/icu/piping/' + id,
    method: 'get'
  })
}
