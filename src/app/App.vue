<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'

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
  <RouterView />
</template>
