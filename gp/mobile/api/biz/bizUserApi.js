import request from '@/utils/request'

// 获取人员分页
export function userPage(data) {
	return request({
		url: '/biz/user/page',
		method: 'get',
		data: data
	})
}

// 提交表单 add为false时为编辑，默认为新增
export function submitForm(data, add = true) {
	return request({
		url: '/biz/user/' + (add ? 'add' : 'edit'),
		method: 'post',
		data: data
	})
}

// 删除人员
export function userDelete(data) {
	return request({
		url: '/biz/user/delete',
		method: 'post',
		data: data
	})
}

// 获取人员详情
export function userDetail(data) {
	return request({
		url: '/biz/user/detail',
		method: 'get',
		data: data
	})
}

// 禁用人员
export function userDisableUser(data) {
	return request({
		url: '/biz/user/disableUser',
		method: 'post',
		data: data
	})
}

// 启用人员
export function userEnableUser(data) {
	return request({
		url: '/biz/user/enableUser',
		method: 'post',
		data: data
	})
}

// 重置人员密码
export function userResetPassword(data) {
	return request({
		url: '/biz/user/resetPassword',
		method: 'post',
		data: data
	})
}

// 获取组织选择器
export function userOrgTreeSelector(data) {
	return request({
		url: '/biz/user/orgTreeSelector',
		method: 'get',
		data: data
	})
}

// 获取职位选择器
export function userPositionSelector(data) {
	return request({
		url: '/biz/user/positionSelector',
		method: 'get',
		data: data
	})
}

// 获取角色选择器
export function userRoleSelector(data) {
	return request({
		url: '/biz/user/roleSelector',
		method: 'get',
		data: data
	})
}

// 获取人员选择器
export function userSelector(data) {
	return request({
		url: '/biz/user/userSelector',
		method: 'get',
		data: data
	})
}

// 人员拥有角色
export function userOwnRole(data) {
	return request({
		url: '/biz/user/ownRole',
		method: 'get',
		data: data
	})
}

// 给人员授权角色
export function grantRole(data) {
	return request({
		url: '/biz/user/grantRole',
		method: 'post',
		data: data
	})
}
