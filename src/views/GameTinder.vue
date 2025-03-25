<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import apiClient from '@/axios'

const step = ref('filters')

const priceEnabled = ref(false)
const reviewsEnabled = ref(false)
const positiveRatioEnabled = ref(false)
const linuxEnabled = ref(null)
const macEnabled = ref(null)

const price = ref([0, 100])
const reviews = ref([0, 7500000])
const positiveRatio = ref([0, 100])

const currentGame = ref({ id_game: 0, title: '', header_image: '', short_description: '' })

const isPlayed = ref<boolean | null>(null)
const likeToPlay = ref<boolean | null>(null)
const rating = ref(5)

const feedbackProvided = computed(() => {
  if (isPlayed.value === true) return rating.value !== null
  if (isPlayed.value === false) return likeToPlay.value !== null
  return false
})

const fetchGame = async () => {
  const params: any = {}
  if (priceEnabled.value) params.price_final = { min_value: price.value[0], max_value: price.value[1] }
  if (reviewsEnabled.value) params.user_reviews = { min_value: reviews.value[0], max_value: reviews.value[1] }
  if (positiveRatioEnabled.value) params.positive_ratio = { min_value: positiveRatio.value[0], max_value: positiveRatio.value[1] }
  if (linuxEnabled.value) params.linux = true
  if (macEnabled.value) params.mac = true

  const { data: recData } = await apiClient.post('/recommender/get_game', params)
  const { data: gameData } = await apiClient.get(`/game/${recData.id_game}`)

  currentGame.value = { id_game: recData.id_game, ...gameData }
  step.value = 'game'
}

const { refetch: fetchNewGame, isFetching: isFetchingGame } = useQuery({
  queryKey: ['get_game'],
  queryFn: fetchGame,
  enabled: false,
})

const { mutate: sendFeedback, isPending: isSendingFeedback } = useMutation({
  mutationFn: async () => {
    const feedback = {
      id_game: currentGame.value.id_game,
      has_played: isPlayed.value,
      want_to_play: !isPlayed.value ? likeToPlay.value : null,
      rating: isPlayed.value ? rating.value : null,
    }

    await apiClient.post('/reaction/', feedback)

    isPlayed.value = null
    likeToPlay.value = null
    rating.value = 5

    await fetchNewGame()
  },
})

const convertToThousands = (value: number) => Math.round(value / 1000).toString() + 'k'

const reviewsThousandsMin = computed({
  get: () => {
    return convertToThousands(reviews.value[0])
  },
  set: (value: string) => {
    reviews.value[0] = parseInt(value.substring(0, value.length - 1)) * 1000
    console.log(reviews.value[0])
  } 
})

const reviewsThousandsMax = computed({
  get: () => {
    return convertToThousands(reviews.value[1])
  },
  set: (value: string) => {
    reviews.value[1] = parseInt(value.substring(0, value.length - 1)) * 1000
  } 
})
</script>

<template>
  <v-container fluid>
    <template v-if="step === 'filters'">
      <v-card class="mx-auto my-12" max-width="800">
        <v-card-title class="text-center text-h5">Select Filters or Continue without them</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="9">
              <v-checkbox v-model="priceEnabled" label="Price $" />
              <v-range-slider v-if="priceEnabled" v-model="price" :min="0" :max="100" :step="0.25">
                <template #prepend>
                  <v-text-field readonly v-model.number="price[0]" variant="outlined" hide-details density="compact" style="width:80px;" />
                </template>
                <template #append>
                  <v-text-field readonly v-model.number="price[1]" variant="outlined" hide-details density="compact" style="width:80px;" />
                </template>
              </v-range-slider>

              <v-checkbox v-model="reviewsEnabled" label="Reviews" />
              <v-range-slider v-if="reviewsEnabled" v-model="reviews" :min="0" :max="7500000" :step="1000">
                <template #prepend>
                  <v-text-field readonly v-model="reviewsThousandsMin" variant="outlined" hide-details density="compact" style="width:80px;" />
                </template>
                <template #append>
                  <v-text-field readonly v-model="reviewsThousandsMax" variant="outlined" hide-details density="compact" style="width:80px;" />
                </template>
              </v-range-slider>

              <v-checkbox v-model="positiveRatioEnabled" label="Positive Ratio" />
              <v-range-slider v-if="positiveRatioEnabled" v-model="positiveRatio" :min="0" :max="100" :step="1">
                <template #prepend>
                  <v-text-field readonly v-model.number="positiveRatio[0]" variant="outlined" hide-details density="compact" style="width:80px;" />
                </template>
                <template #append>
                  <v-text-field readonly v-model.number="positiveRatio[1]" variant="outlined" hide-details density="compact" style="width:80px;" />
                </template>
              </v-range-slider>
            </v-col>

            <v-col cols="3">
              <div class="mb-4"></div>
              <v-radio-group v-model="linuxEnabled" label="Is Linux Supported" inline>
                <v-radio label="Yes" :value="true" />
                <v-radio label="No" :value="false" />
              </v-radio-group>

              <v-radio-group v-model="macEnabled" label="Is Mac Supported" inline>
                <v-radio label="Yes" :value="true" />
                <v-radio label="No" :value="false" />
              </v-radio-group>
            </v-col>
          </v-row>

          <div class="text-center my-4">
            <v-btn color="primary" size="large" @click="fetchGame" :disabled="isFetchingGame">
              <v-progress-circular v-if="isFetchingGame" indeterminate size="20" />
              <span v-else>Go to GameTinder</span>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </template>

    <template v-else>
      <div style="display: flex; flex-wrap: wrap; flex-direction: row; justify-content: center; gap: 20px">
      <v-card class="my-auto" max-width="500">
        <v-card-title class="text-center text-h5">{{ currentGame.title }}</v-card-title>
        <v-img :src="currentGame.header_image" height="215" contain class="my-2" />
        <v-card-text style="text-align: justify;">{{ currentGame.short_description }}</v-card-text>
      </v-card>

      <v-card min-width="305" max-width="500">
        <v-card-text>
          <div class="mb-4">Have you ever played this game?</div>
          <v-radio-group v-model="isPlayed" inline>
            <v-radio label="Yes" :value="true" />
            <v-radio label="No" :value="false" />
          </v-radio-group>

          <div v-if="isPlayed === false">
            <div class="mb-4">Would you like to play?</div>
            <v-radio-group v-model="likeToPlay" inline>
              <v-radio label="Yes" :value="true" />
              <v-radio label="No" :value="false" />
            </v-radio-group>
          </div>

          <div v-if="isPlayed === true">
            <div class="mb-4">Rate the game</div>
            <v-slider v-model="rating" :min="0" :max="10" step="1" show-ticks thumb-label="always"/>
          </div>

          <div v-if="feedbackProvided" class="text-center">
            <v-btn color="primary" @click="sendFeedback" :disabled="isSendingFeedback">
              <v-progress-circular v-if="isSendingFeedback" indeterminate size="20" />
              <span v-else>Get next recommendation</span>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
      </div>

    </template>
  </v-container>
</template>
