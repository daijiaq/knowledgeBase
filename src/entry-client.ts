// src/entry-client.ts
import { createApp } from './main'
import { checkKnowledgeBaseAuth } from './api/knowledgeBase'
import { createPinia } from 'pinia'
import { useKnowledgeBaseStore } from './stores/useKnowledgeBaseStore'

const { app, router, pinia } = createApp()

// SSR hydration: 恢复 Pinia state
if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
  pinia.state.value = window.__INITIAL_STATE__
}

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next('/login')
    } else {
      if (to.path.includes('/knowledgeBase/') && to.params.knowledgeBaseId) {
        const knowledgeBaseId = to.params.knowledgeBaseId
        try {
          const response = await checkKnowledgeBaseAuth(Number(knowledgeBaseId))
          if (response.data) {
            next()
          } else {
            next('/knowledgeBase/KnowledgeBaseMain')
          }
        } catch (error) {
          console.error('Auth check error:', error)
          next('/knowledgeBase/KnowledgeBaseMain')
        }
        return
      }
    }
  }
  next()
})

router.isReady().then(() => {
  app.mount('#app')
})
