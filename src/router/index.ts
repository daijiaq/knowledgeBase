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
        path: ':knowledgeBaseId/:docId?',
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
