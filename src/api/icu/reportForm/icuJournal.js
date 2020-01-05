
import request from '@/router/axios'

// icu按时间查询
export function fetchList(data) {
   return request({
      url: '/icu/icurecord/page',
      method: 'get',
      params: data
   })
}