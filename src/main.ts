import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { App, router } from '@/app'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { VueQueryPlugin } from '@tanstack/vue-query'



const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark'
  }
})


const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)
app.use(VueQueryPlugin)


app.mount('#app')
