import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import _ from "lodash"
import './components/vxetableCommon/table/renderer/index.js';
import plugins from '../src/utils/plugins.js'
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(plugins)
Vue.use(VXETable)
Vue.prototype._ = _;
new Vue({
  render: h => h(App),
}).$mount('#app')
