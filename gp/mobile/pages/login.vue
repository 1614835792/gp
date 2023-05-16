<template>
	<view class="normal-login-container">
		<view class="logo-content align-center justify-center flex">
			<image style="width: 100rpx;height: 100rpx;" :alt="sysBaseConfig.SNOWY_SYS_NAME"
				:src="sysBaseConfig.SNOWY_SYS_LOGO" mode="widthFix">
			</image>
			<text class="title">{{sysBaseConfig.SNOWY_SYS_NAME}} {{sysBaseConfig.SNOWY_SYS_VERSION}}</text>
		</view>
		<view class="login-form-content">
			<view class="input-item flex align-center">
				<view class="iconfont icon-user icon"></view>
				<input v-model="loginForm.account" class="input" type="text" placeholder="请输入账号" maxlength="30" />
			</view>
			<view class="input-item flex align-center">
				<view class="iconfont icon-password icon"></view>
				<input v-model="loginForm.password" type="password" class="input" placeholder="请输入密码" maxlength="20" />
			</view>
			<view class="input-item flex align-center" v-if="sysBaseConfig.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN === 'true'">
				<view class="iconfont icon-code icon"></view>
				<input v-model="loginForm.validCode" type="text" class="input" placeholder="请输入验证码" maxlength="4" />
				<image :src="validCodeBase64" @click="loginCaptcha" class="login-code-img"></image>
			</view>
			<view class="action-btn">
				<button @click="handleLogin" class="login-btn cu-btn block bg-blue lg round">登录</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		getCurrentInstance
	} from 'vue'
	import {
		login,
		//getLoginUser,
		getPicCaptcha
	} from '@/api/login'
	import {
		configSysBaseList
	} from '@/api/dev/configApi'
	import {
		getToken,
		setToken,
		removeToken
	} from '@/utils/auth'
	import store from '@/store'
	import smCrypto from '@/utils/smCrypto'
	const {
		proxy
	} = getCurrentInstance()

	let sysBaseConfig = ref({})
	
	// 确保获取准确的配置信息（防止因网络延迟导致的配置信息不同步）
	store.dispatch('GetSysBaseConfig').then(configData=>{
		sysBaseConfig.value =  configData
		if (sysBaseConfig.value.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN) {
			loginCaptcha()
		}
	})
	
	const validCodeBase64 = ref("")
	const loginForm = reactive({
		account: '123',
		password: '123',
		validCode: '',
		validCodeReqNo: '',
	})

	// 获取图形验证码
	const loginCaptcha = () => {
		getPicCaptcha().then(res => {
			validCodeBase64.value = res.data.validCodeBase64
			loginForm.validCodeReqNo = res.data.validCodeReqNo
		})
	}
	// 登录方法
	const handleLogin = async () => {
		if (loginForm.account === "") {
			proxy.$modal.msgError("请输入您的账号")
		} else if (loginForm.password === "") {
			proxy.$modal.msgError("请输入您的密码")
		} else if (loginForm.validCode === "" && sysBaseConfig.value.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN === 'true') {
			proxy.$modal.msgError("请输入验证码")
		} else {
			pwdLogin()
		}
	}
	// 密码登录
	const pwdLogin = async () => {
		proxy.$modal.loading("登录中...")
		// store.dispatch('Login', loginForm).then(() => {
		// 	// 所有异步请求结束之后才能够进行下一步操作
		// 	Promise.all([
		// 		// store.dispatch('GetUserLoginMenu'),
		// 		 store.dispatch('GetUserInfo'),
		// 		// store.dispatch('GetDictTypeTreeData'),
		// 	]).then((result) => {
		// 		//proxy.$tab.reLaunch('/pages/home/index.html')
		// 		window.location.href = "/pages/home/index.html"
		// 		proxy.$modal.closeLoading()
		// 	}).catch(err => {
		// 		console.error(err)
		// 	})
		// }).catch(err => {
		// 	console.error(err)
		// })
        window.location.href = "/pages/home/index.html"
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}

	.normal-login-container {
		width: 100%;

		.logo-content {
			width: 100%;
			font-size: 21px;
			text-align: center;
			padding-top: 15%;

			image {
				border-radius: 4px;
			}

			.title {
				margin-left: 10px;
			}
		}

		.login-form-content {
			text-align: center;
			margin: 20px auto;
			margin-top: 15%;
			width: 80%;

			.input-item {
				margin: 20px auto;
				background-color: #f5f6f7;
				height: 45px;
				border-radius: 20px;

				.icon {
					font-size: 38rpx;
					margin-left: 10px;
					color: #999;
				}

				.input {
					width: 100%;
					font-size: 14px;
					line-height: 20px;
					text-align: left;
					padding-left: 15px;
				}

			}

			.login-btn {
				margin-top: 40px;
				height: 45px;
			}

			.xieyi {
				color: #333;
				margin-top: 20px;
			}
		}

		.easyinput {
			width: 100%;
		}
	}

	.login-code-img {
		border: 1px solid var(--border-color-split);
		cursor: pointer;
		width: 70%;
		height: 45px
	}
</style>
