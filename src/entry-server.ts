// src/entry-server.ts
import { renderToString } from '@vue/server-renderer'
import { createApp } from './main'
import { useKnowledgeBaseStore } from './stores/useKnowledgeBaseStore'
import { getAllKBsApi, getKBsRecentApi, getKBsContentApi } from './api/knowledgeBase'
import { setSSRToken } from './utils/request'

// 从 cookie 字符串中解析 token
function extractTokenFromCookie(cookie?: string): string | undefined {
  if (!cookie) return undefined
  const match = cookie.match(/token=([^;]+)/)
  return match ? match[1] : undefined
}

export async function render(url: string, cookie?: string) {
  const token = extractTokenFromCookie(cookie)
  if (token) setSSRToken(token)
  // 打印 axios headers
  const instance = (await import('./utils/request')).default
  const { app, router, pinia } = createApp(url)
  await router.push(url)
  await router.isReady()

  // SSR 数据预取
  const matched = router.currentRoute.value.matched
  const route = router.currentRoute.value
  const knowledgeBaseStore = useKnowledgeBaseStore()
  // 只对 KnowledgeBaseMain 页面做数据预取
  if (route.name === 'KnowledgeBaseMain') {
    // 预取知识库列表和最近访问
    const [allKBs, recentKBs] = await Promise.all([
      getAllKBsApi().then(res => {
        return res.data
      }).catch(err => {
        console.error('[SSR Error] getAllKBsApi failed:', err)
        return []
      }),
      getKBsRecentApi(5).then(res => {
        return res.data
      }).catch(err => {
        console.error('[SSR Error] getKBsRecentApi failed:', err)
        return []
      })
    ])
    knowledgeBaseStore.setState({
      knowledgeBaseList: allKBs,
      recentKBsList: recentKBs
    })
  }

  const html = await renderToString(app)
  // 注入 Pinia state
  const state = JSON.stringify(pinia.state.value)
  // 返回带有 window.__INITIAL_STATE__ 的 HTML
  return `<!DOCTYPE html><html><head></head><body><div id="app">${html}</div><script>window.__INITIAL_STATE__ = ${state}</script></body></html>`
}
