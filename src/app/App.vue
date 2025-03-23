<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'
import TopPanel from '@/components/TopPanel.vue'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  const authToken = localStorage.getItem('auth_token')
  if (!authToken && route.name !== 'Login' && route.name !== 'Register') {
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
  }
})
</script>

<template>
  <v-app>
    <TopPanel />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
