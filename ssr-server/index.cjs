const express = require('express')
const fs = require('fs')
const path = require('path')
const { render } = require('../dist-ssr/entry-server.js')

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
  console.error('? index.html not found. Did you build client with `vite build`?')
  process.exit(1)
}

// 3. SSR 路由处理
app.get('*', async (req, res) => {
  try {
    const url = req.originalUrl
     console.log('Incoming URL for SSR render:', url)
    const appHtml = await render(url)

    const html = template.replace(`<!--app-html-->`, appHtml)
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (err) {
    console.error('SSR render error:', err)
    res.status(500).end('Internal Server Error')
  }
})

// 4. 启动服务
app.listen(3001, () => {
  console.log('? SSR server is running at http://localhost:3001')
})
