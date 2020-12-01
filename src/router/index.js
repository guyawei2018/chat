import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "about" */ '../views/register.vue')
  },
  {
    path: '/header',
    name: 'Header',
    component: () => import(/* webpackChunkName: "about" */ '../views/tabbar/me/header.vue')
  },
  {
    path: '/photo',
    name: 'Photo',
    component: () => import(/* webpackChunkName: "about" */ '../views/tabbar/me/photo.vue')
  },
  {
    path: '/nikename',
    name: 'nikeName',
    component: () => import(/* webpackChunkName: "about" */ '../views/tabbar/me/nikename.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "about" */ '../views/tabbar/discovery/search.vue')
  },
  {
    path: '/friendInfo',
    name: 'friendInfo',
    component: () => import(/* webpackChunkName: "about" */ '../views/tabbar/discovery/friendInfo.vue')
  },
  {
    path: '/scanme',
    name: 'scanme',
    component: () => import(/* webpackChunkName: "about" */ '../views/tabbar/discovery/scanme.vue')
  },
  {
    path: '/chatting',
    name: 'chatting',
    component: () => import(/* webpackChunkName: "about" */ '../views/tabbar/address/chatting.vue')
  },
  {
    path: '/index',
    name: 'Index',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/index.vue'),
    children: [
      {
        path: '/chat',
        name: 'Chat',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/tabbar/chat.vue')
      },
      {
        path: '/discovery',
        name: 'Discovery',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/tabbar/discovery.vue')
      },
      {
        path: '/address',
        name: 'Address',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/tabbar/address.vue')
      },
      {
        path: '/me',
        name: 'Me',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/tabbar/me.vue')
      }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
