// import { createRouter, createWebHistory } from 'vue-router'
// import Login from '../pages/login.vue'
// import knowledgeBase from '../pages/knowledgeBase.vue'
// import { checkKnowledgeBaseAuth } from '../api/knowledgeBase'

// //定义路由规则
// const routes = [
//     {
//         path: '/', 
//          component: Login
//     },
//     {
//         path: '/login', 
//         component: Login
//     }, 
//     {
//         path: '/knowledgeBase',
//         component: knowledgeBase,
//         meta: { requiresAuth: true }, // 需要登录才能访问
//         children: [
//         {
//           path: "KnowledgeBaseMain",
//           name: "KnowledgeBaseMain",
//           component: () => import("../components/knowledgeBaseMain.vue"),
//         },
//         {
//           path: ":knowledgeBaseId",
//           component: () => import('../pages/document.vue')
//         },
//         {
//           path:"",
//           redirect: '/knowledgeBase/KnowledgeBaseMain'
//         },
//         {
//           path:'*',
//           redirect: '/knowledgeBase/KnowledgeBaseMain'
//         },
//       ]
//     }
// ]

// // 3. 创建路由实例
// const router = createRouter({
//     history: createWebHistory(), // 使用 HTML5 History 模式
//     routes,
// })

// // 全局前置守卫
// router.beforeEach(async (to, from, next) => {
//   const isAuthenticated = localStorage.getItem('token') // 例：检查登录状态
//   if(to.meta.requiresAuth){
//     if(!isAuthenticated){
//       next('/login') // 跳转到登录页
//       return
//     }else{    
//       if(to.path.includes('/knowledgeBase/')&&to.params.knowledgeBaseId){ 
//         //检查知识库权限
//         const knowledgeBaseId = to.params.knowledgeBaseId
//         try {
//           const response = await checkKnowledgeBaseAuth(Number(knowledgeBaseId))
//           if (response.data) {
//             next() // 允许访问
//           } else {
//             next('/knowledgeBase/KnowledgeBaseMain') // 没有权限，重定向到知识库主页
//           }
//         } catch (error) {
//           console.error('Error checking knowledge base auth:', error)
//           next('/knowledgeBase/KnowledgeBaseMain') // 出错时重定向到知识库主页
//         }
//         return
//       }
//     }
//   }
//   next() // 继续导航
// })

// export default router
// src/router/index.ts
import {
  createRouter as _createRouter,
  createWebHistory,
  createMemoryHistory
} from 'vue-router'

import Login from '../pages/login.vue'
import knowledgeBase from '../pages/knowledgeBase.vue'

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/knowledgeBase',
    component: knowledgeBase,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'KnowledgeBaseMain',
        name: 'KnowledgeBaseMain',
        component: () => import('../components/knowledgeBaseMain.vue')
      },
      {
        path: ':knowledgeBaseId',
        component: () => import('../pages/document.vue')
      },
      {
        path: '',
        redirect: '/knowledgeBase/KnowledgeBaseMain'
      }
    ]
  },
   {
        path: '/:pathMatch(.*)*',
        redirect: '/knowledgeBase/KnowledgeBaseMain'
    }
]

// SSR 支持：通过传参动态选择 history 模式
export function createRouter(url = '/') {
  return _createRouter({
    history: typeof window === 'undefined' ? createMemoryHistory(url) : createWebHistory(),
    routes
  })
}
