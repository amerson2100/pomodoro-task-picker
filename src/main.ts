
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { initSounds } from './composables/useSound'

const app = createApp(App)

app.use(createPinia())
initSounds()
app.mount('#app')
