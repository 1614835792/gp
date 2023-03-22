import request from '@/utils/request'

// 获取机构分页
export function orgPage(data) {
	return request({
		url: '/biz/org/page',
		method: 'get',
		data: data
	})
}

// 获取机构树
export function orgTree(data) {
	return request({
		url: '/biz/org/tree',
		method: 'get',
		data: data
	})
}

// 提交表单 add为false时为编辑，默认为新增
export function submitForm(data, add = true) {
	return request({
		url: '/biz/org/' + (add ? 'add' : 'edit'),
		method: 'post',
		data: data
	})
}

// 删除机构
export function orgDelete(data) {
	return request({
		url: '/biz/org/delete',
		method: 'post',
		data: data
	})
}

// 获取机构详情
export function orgDetail(data) {
	return request({
		url: '/biz/org/detail',
		method: 'get',
		data: data
	})
}
