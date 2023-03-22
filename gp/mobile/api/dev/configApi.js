import request from '@/utils/request'

export function configSysBaseList() {
	return request({
		url: '/dev/config/sysBaseList',
		headers: {
			isToken: true
		},
		method: 'get',
		timeout: 20000
	})
}
