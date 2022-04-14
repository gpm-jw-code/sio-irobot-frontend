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

Vue.use(VueApexCharts)
Vue.use(VueDummy)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false
Vue.prototype.$configs = configs;

Vue.component('apexchart', VueApexCharts)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')