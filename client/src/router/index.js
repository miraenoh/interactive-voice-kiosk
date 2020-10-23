import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../pages/Home.vue'
import Customer from '../pages/Customer.vue'
import AdminLogin from '../pages/AdminLogin.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/customer/:id',
    name: 'Customer',
    component: Customer,
    props: true
  },
  {
    path: '/admin/accounts/login',
    name: 'Login',
    component: AdminLogin
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
