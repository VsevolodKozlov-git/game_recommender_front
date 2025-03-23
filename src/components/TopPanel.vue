<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateHome = () => router.push({ name: 'Home' })
const navigateLogin = () => router.push({ name: 'Login' })
const navigateRegister = () => router.push({ name: 'Register' })
const navigateToSection = (section: string) => router.push({ name: section })
</script>

<template>
  <v-app-bar app flat>
    <!-- Project Icon -->
    <v-app-bar-nav-icon @click="navigateHome">
      <v-icon icon="mdi-home"></v-icon>
    </v-app-bar-nav-icon>

    <!-- Site Sections -->
    <v-toolbar-items class="ml-4">
      <v-btn text @click="navigateToSection('GameTinder')">GameTinder</v-btn>
      <!-- <v-btn text @click="navigateToSection('Quizzes')">Quizzes</v-btn> -->
    </v-toolbar-items>

    <!-- Spacer pushes content to sides -->
    <v-spacer></v-spacer>

    <!-- Authentication Buttons -->
    <v-toolbar-items>
      <v-btn text @click="navigateLogin">Exit</v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>
