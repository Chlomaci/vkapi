// Composables
import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/views/MainPage'
import UserPage from '@/views/UserPage'

const routes = [
  {
    path: '/',
    component: MainPage,
  },
  {
    path: '/user/:id',
    component: UserPage,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
