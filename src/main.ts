// import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import 'element-plus/dist/index.css'
// import './public/style.css'
// import App from './App.vue'
// import ElementPlus from 'element-plus'
// import router from './router'
// import 'element-plus/dist/index.css'
// import './public/iconfont.css'

// const app=createApp(App)
// app.use(createPinia())
// app.use(router)
// app.use(ElementPlus)
// app.mount('#app')
// src/main.ts
import { createApp as _createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './public/style.css'
import './public/iconfont.css'
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'

import App from './App.vue'
import { createRouter } from './router' // 注意改成函数方式导出

export function createApp(url = '/') {
  const app = _createApp(App)
  const pinia = createPinia()
  const router = createRouter(url)

  app.use(pinia)
  app.use(router)
  app.use(ElementPlus)

  // SSR: provide id/z-index injection for Element Plus
  if (typeof window === 'undefined') {
    app.provide(ID_INJECTION_KEY, {
      prefix: Math.floor(Math.random() * 10000),
      current: 0
    })
    app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
  }

  return { app, router }
}
