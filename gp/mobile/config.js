const noTokenBackUrl = "/pages/login";
const hasTokenBackUrl = "/pages/home/index"

// 应用全局配置
export default {
	// 服务平台类型（SNOWY或SNOWY_CLOUD）
	SERVER_TYPE: 'SNOWY',

	// 接口地址，也就是后端地址
	 BASE_URL: 'http://localhost:82/app',
	 
  //  BASE_URL: 'http://ngg59g.natappfree.cc/app',

	// 后端配置文件的 snowy.config.common.front-url，相当于前端地址（开源版本非必要）
	TENANT_DOMAIN: "http://localhost:81",

	// 请求超时
	TIMEOUT: 10000,

	// TokenName // Authorization
	TOKEN_NAME: 'token',

	// Token前缀，注意最后有个空格，如不需要需设置空字符串 // Bearer
	TOKEN_PREFIX: '',

	// 系统基础配置，这些是数据库中保存起来的
	SYS_BASE_CONFIG: {
		// 默认logo
		SNOWY_SYS_LOGO: '/static/logo.png',
		// 背景图
		SNOWY_SYS_BACK_IMAGE: '',
		// 系统名称
		SNOWY_SYS_NAME: 'Snowy',
		// 版本
		SNOWY_SYS_VERSION: '2.0',
		// 版权
		SNOWY_SYS_COPYRIGHT: 'Snowy ©2022 Created by xiaonuo.vip',
		// 版权跳转URL
		SNOWY_SYS_COPYRIGHT_URL: 'https://www.xiaonuo.vip',
		// 默认文件存储
		SNOWY_SYS_DEFAULT_FILE_ENGINE: 'LOCAL',
		// 是否开启验证码
		SNOWY_SYS_DEFAULT_CAPTCHA_OPEN: 'false',
		// 默认重置密码
		SNOWY_SYS_DEFAULT_PASSWORD: '123456'
	},

	// 没有token访问退回页面
	NO_TOKEN_BACK_URL: noTokenBackUrl,
	// 不需要登录（没有token）页面白名单
	NO_TOKEN_WHITE_LIST: [
		noTokenBackUrl,
		'/',
		// '/pages/home/index',
	],
	// 有token访问退回页面
	HAS_TOKEN_BACK_URL: hasTokenBackUrl,
	// 登录（有token）可以访问的页面白名单
	HAS_TOKEN_WHITE_LIST: [
		hasTokenBackUrl,
		'/pages/work/index',
		'/pages/mine/index',
		'/pages/mine/setting/index',
		'/pages/mine/info/edit',
		'/pages/mine/pwd/index',
		'/pages/mine/info/index',
		'/pages/biz/custom/index',
		'/pages/biz/business/index',
		'/pages/biz/holding/index',
		'/pages/home/index.html',
		'/pages/biz/business/buy.html'
		
	]
}
