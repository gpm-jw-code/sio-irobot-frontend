import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard'
import TrendCharts from '../views/TrendCharts'
import LoginPage from '../views/LoginPage'
import AdminPage from '../views/AdminPage.vue'

Vue.use(VueRouter)

var routes = [
  {
    path: '/',
    name: '看板模式',
    component: Dashboard,
    showInSideBar: true,
  },
  {
    path: '/trend-charts',
    name: '趨勢圖',
    component: TrendCharts,
    showInSideBar: true,
  },
  {
    path: '/login/:from',
    name: 'Login',
    component: LoginPage,
    showInSideBar: false,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    children: [
      {
        path: 'user',
        name: '用戶管理',
        component: () => import('../components/Admin/UserManager.vue'),
      },
    ],
  },
  {
    path: '*',
    redirect: '/',
  },
]

const router = new VueRouter({
  routes,
})

export default router
