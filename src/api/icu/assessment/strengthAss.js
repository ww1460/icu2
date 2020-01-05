import request from '@/router/axios'

export function getObj(patientId,projectCode) {
	return request({
		url: '/icu/assessType/getAssess',
		method: 'get',
		params:{
			patientId:patientId,
			projectCode:projectCode
		}
	})
}
