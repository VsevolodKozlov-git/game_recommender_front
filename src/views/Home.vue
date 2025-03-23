<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const headerTexts = [
  'Nothing to play in the library?',
  'Want a breath of fresh air?',
  'Our recommendation systems will help you!'
]

const currentText = ref('')
const textIndex = ref(0)
const charIndex = ref(0)
const isDeleting = ref(false)

let typingInterval: number | undefined

const typeEffect = () => {
  const fullText = headerTexts[textIndex.value]

  if (!isDeleting.value) {
    currentText.value = fullText.substring(0, charIndex.value++)
    if (charIndex.value > fullText.length) {
      isDeleting.value = true
      clearInterval(typingInterval)
      setTimeout(() => {
        typingInterval = setInterval(typeEffect, 50)
      }, 1500)
    }
  } else {
    currentText.value = fullText.substring(0, charIndex.value--)
    if (charIndex.value === 0) {
      isDeleting.value = false
      textIndex.value = (textIndex.value + 1) % headerTexts.length
      clearInterval(typingInterval)
      setTimeout(() => {
        typingInterval = setInterval(typeEffect, 100)
      }, 500)
    }
  }
}

onMounted(() => {
  typingInterval = setInterval(typeEffect, 100)
})

onUnmounted(() => {
  clearInterval(typingInterval)
})

const goTo = (page: string) => router.push({ name: page })
</script>

<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" class="text-center">
      <v-col cols="12">
        <h1 class="display-1 font-weight-bold mb-10">{{ currentText }}</h1>
      </v-col>

      <v-col cols="12" md="6" lg="4" class="d-flex justify-center gap-6 ga-2">
        <v-btn
          outlined
          size="x-large"
          class="border rounded-lg"
          @click="goTo('GameTinder')"
        >
          GAMETINDER
        </v-btn>

        <!-- <v-btn
          outlined
          size="x-large"
          class="border rounded-lg"
          @click="goTo('Quizzes')"
        >
          QUIZZES
        </v-btn> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.border {
  border: 2px solid rgba(255, 255, 255, 0.12);
}
</style>
