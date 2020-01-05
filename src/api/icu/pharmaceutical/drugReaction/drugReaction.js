// 药物不良反应

import request from '@/router/axios'

// 查询患者
// export function getnurse() {
//    return request({
//       url: '/icu/nursepatientcorrelation/patientInfo',
//       method: 'get'
//    })
// }

export function fetchList(query) {
    return request({
        url: '/icu/adversedrugreactionsrecord/page',
        method: 'get',
        params: query
    })
}


export function UpdateObj(obj) {
    return request({
        url: '/icu/adversedrugreactionsrecord/update',
        method: 'post',
        data: obj

    })
}

export function delObj(id) {
    return request({
        url: '/icu/adversedrugreactionsrecord/' + id,
        method: 'delete',
    })
}




