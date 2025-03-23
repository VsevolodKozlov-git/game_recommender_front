import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import PlaygroundPage from '@/views/PlaygroundPage.vue'
import Home from '@/views/Home.vue'
import GameTinder from '@/views/GameTinder.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/playground', name: 'playground', component: PlaygroundPage },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/', name: 'Home', component: Home},
    { path: '/game_tinder', name: 'GameTinder', component: GameTinder}
  ]
})

export default router
