import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/operators',
    name: 'Operators',
    component: () => import('../views/Operators.vue')
  },
  {
    path: '/formulas',
    name: 'Formulas',
    component: () => import('../views/Formulas.vue')
  },
  {
    path: '/calculator',
    name: 'Calculator',
    component: () => import('../views/Calculator.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 