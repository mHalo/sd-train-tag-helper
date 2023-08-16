import '@/styles/global.scss'

import { createApp } from 'vue'
import App from './App.vue'

import { Icon } from '@iconify/vue'

/** app配置 */
const app = createApp(App)
/** iconify */
app.component('VIcon', Icon)

app.mount('#app')
