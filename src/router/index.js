import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard'
import TrendCharts from '../views/TrendCharts'
import LoginPage from '../views/LoginPage'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '看板模式',
    component: Dashboard,
    showInSideBar:true
  },
  {
    path: '/trend-charts',
    name: '趨勢圖',
    component: TrendCharts,
    showInSideBar:true
  },
  {
    path: '/trend-charts/:eqid/:field', 
    name: '趨勢圖',
    component: TrendCharts,
    showInSideBar:false
  },
  {
    path: '/login/:from', 
    name: 'Login',
    component: LoginPage,
    showInSideBar:false
  }
]

const router = new VueRouter({
  routes
})

export default router
