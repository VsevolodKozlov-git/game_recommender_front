<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'
import apiClient from '@/axios';
// import axios from 'axios';

const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const snackbar = ref(false)
const snackbarMessage = ref('')

const {isPending, mutate} = useMutation({
  mutationFn: async () => {
    // const response = await apiClient.post('/user/get_token', {
    const response = await apiClient.post('http://localhost:8000/user/token', {
      username: username.value,
      password: password.value,
    })
    return response.data
  },
  onSuccess: (data) => {
    localStorage.setItem('auth_token', data.access_token)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  },
  onError: (error) => {
    console.log(error)
    snackbarMessage.value = 'Error occurred. Please try later'
    snackbar.value = true
  },
})
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title class="text-center">Login</v-card-title>

          <v-card-text>
            <v-text-field
              label="Username"
              v-model="username"
              required
              variant="outlined"
            />
            <v-text-field
              label="Password"
              v-model="password"
              type="password"
              required
              variant="outlined"
            />
          </v-card-text>

          <v-card-actions class="justify-space-between">
            <v-btn @click="mutate" color="primary" :disabled="isPending">
              <v-progress-circular indeterminate v-if="isPending" size="20" />
              <v-else>Send</v-else>
            </v-btn>

            <v-btn variant="text" @click="router.push({ name: 'Register' })">Sign up</v-btn>
          </v-card-actions>
        </v-card>

        <v-snackbar v-model="snackbar" timeout="3000">
          {{ snackbarMessage }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>
