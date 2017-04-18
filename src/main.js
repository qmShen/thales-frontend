// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import router from './router'

Vue.config.productionTip = false
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
