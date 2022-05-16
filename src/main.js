import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './registerServiceWorker'
import configs from './config'
import VueDummy from "vue-dummy"
import VueApexCharts from 'vue-apexcharts'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import {userInfo,dataInfo} from './state'

Vue.component('apexchart', VueApexCharts)
Vue.use(ElementUI);
Vue.use(VueApexCharts)
Vue.use(VueDummy)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
    
Vue.config.productionTip = false
Vue.prototype.$configs = configs;
Vue.prototype.$axios = axios;
Vue.prototype.$userInfo = userInfo
Vue.prototype.$dataInfo = dataInfo


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')