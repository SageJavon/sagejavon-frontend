import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'

async function bootstrap() {
  const app = createApp(App)
  app.use(createPinia())
  setupAssets()

  setupScrollbarStyle()

  setupStore(app)

  setupI18n(app)

  await setupRouter(app)
  app.mount('#app')
}

bootstrap()
