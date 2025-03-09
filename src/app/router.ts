import { createRouter, createWebHistory } from 'vue-router'
import { PlaygroundPage } from '@/pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/playground', name: 'playground', component: PlaygroundPage }
  ]
})

export default router
