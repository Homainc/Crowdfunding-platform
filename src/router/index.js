import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/sign-in',
    name: 'signin',
    component: () => import('../views/SignIn.vue')
  },
  {
    path: '/sign-up',
    name: 'signup',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/project/:id',
    name: 'project_info',
    component: () => import('../views/ProjectInfo.vue'),
    props: true,
  }
]

const router = new VueRouter({
  routes
})

export default router
