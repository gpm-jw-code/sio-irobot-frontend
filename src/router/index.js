import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard'
import TrendCharts from '../views/TrendCharts'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '看板模式',
    component: Dashboard
  },
  {
    path: '/trend-charts',
    name: '趨勢圖',
    component: TrendCharts
  }
]

const router = new VueRouter({
  routes
})

export default router
