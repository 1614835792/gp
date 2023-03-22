<script>
	import store from '@/store'
	import {
		getToken,
		checkPermission
	} from '@/utils/auth'
	import config from '@/config'
	import {
		configSysBaseList
	} from '@/api/dev/configApi'

	export default {
		onLaunch: function() {
			store.dispatch('GetSysBaseConfig')
			//#ifdef H5
			checkPermission(location.pathname)
			//#endif
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="scss">
	@import '@/static/scss/index.scss';
</style>
