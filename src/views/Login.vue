<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'
import apiClient from '@/axios';
// import axios from 'axios';
import qs from 'qs';

const router = useRouter()
const route = useRoute()

const username = ref(null);
const password = ref(null);
const snackbar = ref(false)
const snackbarMessage = ref('')

const isFieldsEntered = computed(() => username.value && password.value) 

const {isPending, mutate} = useMutation({
  mutationFn: async () => {
    // const response = await apiClient.post('/user/get_token', {
    const request_data = {
      username: username.value,
      password: password.value,
    }

    const response = await apiClient.post('http://localhost:8000/user/token', 
      qs.stringify(request_data)
      )
    return response.data
  },
  onSuccess: (data) => {
    localStorage.setItem('auth_token', data.access_token)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  },
  onError: (error) => {
    const detail =
    error?.response?.data?.detail || 'Error occurred. Please try later'
    snackbarMessage.value = detail
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
            <v-btn @click="mutate" color="primary" :disabled="isPending || !isFieldsEntered">
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
