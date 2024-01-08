import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import _ from "lodash"
//我的是创建在根目录的config下,所以@/config/vxetableRenderer.js
import './components/vxetableRenderer.js';
import './components/render/jest.js';
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VXETable)
Vue.prototype._ = _;
new Vue({
  render: h => h(App),
}).$mount('#app')
