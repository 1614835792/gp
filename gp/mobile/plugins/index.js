import tab from './tab'
import modal from './modal'
import store from '../store'
import tool from './tool'
import { hasPerm } from './permission'
export default {
	install(Vue) {
		// 页签操作
		Vue.prototype.$tab = tab
		// 模态框对象
		Vue.prototype.$modal = modal

		Vue.prototype.$store = store
		
		Vue.prototype.$tool = tool
		
		Vue.prototype.hasPerm = hasPerm
	}
}
