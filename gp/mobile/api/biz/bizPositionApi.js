import request from '@/utils/request'

// 获取岗位分页
export function positionPage(data) {
	return request({
		url: '/biz/position/page',
		method: 'get',
		data: data
	})
}

// 获取岗位列表
export function positionList(data) {
	return request({
		url: '/biz/position/list',
		method: 'get',
		data: data
	})
}

// 提交表单 add为false时为编辑，默认为新增
export function submitForm(data, add = true) {
	return request({
		url: '/biz/position/' + (add ? 'add' : 'edit'),
		method: 'post',
		data: data
	})
}

// 删除岗位
export function positionDelete(data) {
	return request({
		url: '/biz/position/delete',
		method: 'post',
		data: data
	})
}

// 获取岗位详情
export function positionDetail(data) {
	return request({
		url: '/biz/position/detail',
		method: 'get',
		data: data
	})
}
