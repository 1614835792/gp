// import upload from '@/utils/upload'
import request from '@/utils/request'

// 获取登录用户的移动端菜单
export function userLoginMobileMenu() {
	return request({
		url: '/sys/userCenter/loginMobileMenu',
		method: 'get'
	})
}

// 编辑个人信息
export function userUpdateUserInfo(data) {
	return request({
		url: '/sys/userCenter/updateUserInfo',
		method: 'post',
		data: data
	})
}

// 修改用户密码
export function userUpdatePassword(data) {
	return request({
		url: '/sys/userCenter/updatePassword',
		method: 'post',
		data: data
	})
}
