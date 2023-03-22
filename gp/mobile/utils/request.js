import store from '@/store'
import {
	getToken
} from '@/utils/auth'
import {
	errorCodeMap,
	reloadCodes
} from '@/utils/errorCode'
import {
	toast,
	showConfirm,
	tansParams
} from '@/utils/common'
import config from '@/config'
import { prefixUrl } from "@/utils/apiAdaptive"

const {
	BASE_URL,
	TIMEOUT,
	TOKEN_NAME,
	TOKEN_PREFIX,
	TENANT_DOMAIN
} = config

const request = config => {
	// 适配URL路径
	config.url = prefixUrl(config.url)
	// 是否需要设置 token
	const isToken = (config.headers || {}).isToken === false
	config.header = config.header || {}
	if (getToken() && !isToken) {
		config.header[TOKEN_NAME] = TOKEN_PREFIX + getToken()
	}
	config.header.Domain = TENANT_DOMAIN
	// get请求映射params参数
	if (config.params) {
		let url = config.url + '?' + tansParams(config.params)
		url = url.slice(0, -1)
		config.url = url
	}
	return new Promise((resolve, reject) => {
		uni.request({
				method: config.method || 'get',
				timeout: config.timeout || TIMEOUT,
				url: config.baseUrl || BASE_URL + config.url,
				data: config.data,
				header: config.header,
				dataType: 'json'
			}).then(response => {
				const code = response.data.code || 200
				const msg = response.data.msg || errorCodeMap[code] || errorCodeMap['default']
				if (reloadCodes.includes(code)) {
					showConfirm('登录状态已过期，您可以清除缓存，重新进行登录?').then(res => {
						if (res.confirm) {
							store.commit('CLEAR_cache')
							uni.reLaunch({
								url: '/pages/login'
							})
						}
					})
					reject('无效的会话，或者会话已过期，请重新登录。')
				} else if (code !== 200) {
					toast(msg)
					reject(code)
				}
				resolve(response.data)
			})
			.catch(error => {
				let {
					errMsg
				} = error
				if (errMsg === 'Network Error') {
					errMsg = '后端接口连接异常'
				} else if (errMsg.includes('timeout')) {
					errMsg = '系统接口请求超时'
				} else if (errMsg.includes('Request failed with status code')) {
					errMsg = '系统接口' + errMsg.substr(errMsg.length - 3) + '异常'
				} else if (errMsg.includes('request:fail')) {
					errMsg = '请求失败'
				}
				toast(errMsg)
				reject(error)
			})
	})
}

export default request
