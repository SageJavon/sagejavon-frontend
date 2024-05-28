import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'

import 'ant-design-vue/dist/reset.css'
import '@/style/init.css'
import 'remixicon/fonts/remixicon.css'

const app = createApp(App)

app.use(Antd).mount('#app')
async function bootstrap() {
  const app = createApp(App)
  app.use(createPinia())
  setupAssets()

  setupScrollbarStyle()

  setupStore(app)

  setupI18n(app)

  await setupRouter(app)
  app.use(Antd)
  app.mount('#app')
}

bootstrap()
