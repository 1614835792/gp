import config from '@/config'
import storage from '@/utils/storage'
import constant from '@/utils/constant'
import smCrypto from '@/utils/smCrypto'
import {
	login,
	getLoginUser,
	logout
} from '@/api/login'
import {
	userLoginMobileMenu
} from '@/api/system/userCenterApi'
import {
	getToken,
	setToken,
	removeToken
} from '@/utils/auth'

import {
	configSysBaseList
} from '@/api/dev/configApi'

import {
	dictTree
} from '@/api/dev/dictApi'
import XEUtils from 'xe-utils'

export default {
	state: {
		// token信息
		token: getToken(),
		// 用户移动端菜单（用户菜单处理后的结果）
		userMobileMenus: storage.get(constant.userMobileMenus),
		// 用户信息
		userInfo: storage.get(constant.userInfo),
		// 系统配置
		sysBaseConfig: storage.get(constant.sysBaseConfig),
		// 字典数据
		dictTypeTreeData: storage.get(constant.dictTypeTreeData),
	},
	mutations: {
		SET_token: (state, token) => {
			state.token = token
			setToken(token)
		},
		SET_userMobileMenus: (state, userMobileMenus) => {
			state.userMobileMenus = userMobileMenus
			storage.set(constant.userMobileMenus, userMobileMenus)
		},
		SET_userInfo: (state, userInfo) => {
			state.userInfo = userInfo
			storage.set(constant.userInfo, userInfo)
		},
		SET_sysBaseConfig: (state, sysBaseConfig) => {
			state.sysBaseConfig = sysBaseConfig
			storage.set(constant.sysBaseConfig, sysBaseConfig)
		},
		SET_dictTypeTreeData: (state, dictTypeTreeData) => {
			state.dictTypeTreeData = dictTypeTreeData
			storage.set(constant.dictTypeTreeData, dictTypeTreeData)
		},
		// 清除缓存
		CLEAR_cache: (state) => {
			// token
			state.token = ''
			removeToken()
			// 移动端用户菜单
			state.userMobileMenus = {}
			storage.remove(constant.userMobileMenus)
			// 用户信息
			state.userInfo = {}
			storage.remove(constant.userInfo)
			// 字典信息
			state.dictTypeTreeData = {}
			storage.remove(constant.dictTypeTreeData)
			// 配置信息
			state.sysBaseConfig = {}
			storage.remove(constant.sysBaseConfig)

			// storage.clean()
		},
	},
	actions: {
		// 登录获取token
		Login({
			commit
		}, userInfo) {
			const paramData = {
				account: userInfo.account.trim(),
				// 密码进行SM2加密，传输过程中看到的只有密文，后端存储使用hash
				password: smCrypto.doSm2Encrypt(userInfo.password),
				validCode: userInfo.validCode,
				validCodeReqNo: userInfo.validCodeReqNo
			}
			return new Promise((resolve, reject) => {
				login(paramData).then(res => {
					// 缓存token
					commit('SET_token', res.data)
					resolve(res.data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 获取用户信息
		GetUserInfo({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				getLoginUser().then(res => {
					// 缓存用户信息
					commit('SET_userInfo', res.data)
					resolve(res.data)
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 获取登錄用戶菜單
		GetUserLoginMenu({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				userLoginMobileMenu().then(res => {
					// 缓存移动端用户菜单
					commit('SET_userMobileMenus', res.data)
					resolve(res.data)
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 获取数据字典
		GetDictTypeTreeData({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				dictTree().then((res) => {
					if (res.data) {
						// 缓存字典
						commit('SET_dictTypeTreeData', res.data)
						resolve(res.data)
					}
				}).catch(error => {
					reject(error)
				})
			})

		},

		// 获取系统基础配置
		GetSysBaseConfig({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				let sysBaseConfig = config.SYS_BASE_CONFIG
				// getApp().globalData.config = config
				commit('SET_sysBaseConfig', sysBaseConfig)
				configSysBaseList().then((res) => {
					if (res.data) {
						res.data.forEach((item) => {
							sysBaseConfig[item.configKey] = item.configValue
						})
						// 缓存配置
						commit('SET_sysBaseConfig', sysBaseConfig)
						resolve(sysBaseConfig)
					}
				})
			}).catch(error => {
				reject(error)
			})
		},
		
		// 退出系统
		LogOut({
			commit,
			state,
			dispatch
		}) {
			return new Promise((resolve, reject) => {
				logout().then(() => {
					// 清除缓存
					commit('CLEAR_cache')
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		}

	}
}
