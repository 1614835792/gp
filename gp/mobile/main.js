import App from './App'
import './interceptor'
import XEUtils from 'xe-utils'
import VXEUtils from 'vxe-utils'


// #ifndef VUE3
import Vue from 'vue'
import plugins from './plugins' // plugins
Vue.use(plugins)
Vue.use(VXEUtils, XEUtils, { mounts: ['cookie'] })
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import tab from '@/plugins/tab'
import modal from '@/plugins/modal'
import store from './store'
import tool from '@/plugins/tool'
import { hasPerm } from '@/plugins/permission'
export function createApp() {
  const app = createSSRApp(App)
  app.use(VXEUtils, XEUtils, { mounts: ['cookie'] })
  app.config.globalProperties.$tab = tab
  app.config.globalProperties.$modal = modal
  app.config.globalProperties.$store = store
  app.config.globalProperties.$tool = tool
  app.config.globalProperties.hasPerm = hasPerm
  
  return {
    app
  }
}
// #endif