import request from '@/utils/request'

// 获取字典分页
export function dictPage() {
	return request({
		url: '/dev/dict/page',
		method: 'get',
		data: data
	})
}

// 获取字典列表
export function dictList(data) {
	return request({
		url: '/dev/dict/list',
		method: 'get',
		data: data
	})
}

// 获取字典树
export function dictTree(data) {
	return request({
		url: '/dev/dict/tree',
		method: 'get',
		data: data
	})
}

// 提交表单 add为false时为编辑，默认为新增
export function submitForm(data, add = true) {
	return request({
		url: '/dev/dict/' + (add ? 'add' : 'edit'),
		method: 'post',
		data: data
	})
}

// 删除字典
export function dictDelete(data) {
	return request({
		url: '/dev/dict/delete',
		method: 'post',
		data: data
	})
}

// 获取字典详情
export function dictDetail(data) {
	return request({
		url: '/dev/dict/detail',
		method: 'get',
		data: data
	})
}
