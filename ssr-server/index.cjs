const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

// 1. 静态资源服务（确保能访问 dist 下的资源）
app.use('/assets', express.static(path.resolve(__dirname, '../dist/assets')))
app.use('/favicon.ico', (req, res) => res.status(204).end())

// 2. 读取 HTML 模板
const templatePath = path.resolve(__dirname, '../dist/index.html')
let template = ''
try {
  template = fs.readFileSync(templatePath, 'utf-8')
} catch (e) {
  console.error('未找到 index.html。是否已执行过 `vite build` 构建客户端')
  process.exit(1)
}

// 3. LRU 缓存
const { LRUCache } = require('lru-cache')
const ssrCache = new LRUCache({
  max: 5,
  ttl: 1000 * 60 * 10 // 缓存10 分钟吧
})


// 4. SSR 路由处理
app.get('*', async (req, res) => {
  try {
    const cacheKey = req.originalUrl
    // 缓存首页和知识库主页
    const isHome = cacheKey === '/'
    const isKBMain = /^\/knowledgeBase\/\d+$/.test(cacheKey)
    if (isHome || isKBMain) {
      if (ssrCache.has(cacheKey)) {
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(ssrCache.get(cacheKey))
      } else {
      }
    }
    const { render } = await import('../dist-ssr/entry-server.js')
    const url = req.originalUrl
    const appHtml = await render(url, req.headers.cookie)
    const html = template.replace(`<!--app-html-->`, appHtml)
    if (isHome || isKBMain) {
      ssrCache.set(cacheKey, html)
    }
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (err) {
    console.error('SSR 渲染出错:', err)
    res.status(500).end('服务器内部错误')
  }
})

// 5. 启动服务
app.listen(3001, () => {
  console.log('SSR 服务已启动，访问地址: http://localhost:3001')
})
