| `/src/entry-client.ts`  | 客户端入口文件             
| `/src/entry-server.ts`  | SSR 服务端渲染入口文件       
| `/ssr-server/index.cjs` | SSR 服务启动脚本（Express） 
| `/dist/`                | Vite 构建后的客户端静态资源    
| `/dist-ssr/`            | SSR 构建生成的服务端 JS 模块  
npm run build               # 构建客户端资源，输出到 dist/
npm run build:ssr           # 构建 SSR 服务端入口，输出到dist-ssr/
node ssr-server/index.cjs   #启动ssr服务
http://localhost:3001       #启动后访问地址
直接用npm run dev不用ssr也可以

