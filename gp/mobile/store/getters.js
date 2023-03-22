const getters = {
	token: state => state.global.token,
	// userMenus: state => state.global.userMenus,
	userMobileMenus: state => state.global.userMobileMenus,
	userInfo: state => state.global.userInfo,
	sysBaseConfig: state => state.global.sysBaseConfig,
	dictTypeTreeData: state => state.global.dictTypeTreeData,
}
export default getters
