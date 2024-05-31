import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'
import '@/assets/icon-font/iconfont.css'
import '@/assets/icon-font/iconfont.css'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import i18n from '@/views/i18n.js'
import store from '@/views/store.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
async function bootstrap() {
  const app = createApp(App)
  app.use(ElementPlus)
  app.use(VueViewer)
  app.use(store)
  await setupRouter(app)
  app.use(i18n)
  app.use(createPinia())

  setupAssets()

  setupScrollbarStyle()

  setupStore(app)

  setupI18n(app)


  app.mount('#app')
}

bootstrap()
