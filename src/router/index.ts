import { createRouter, createWebHistory } from 'vue-router'

//定义路由规则
const routes = [
    {
        path: '/', 
         component: () => import('../pages/login.vue')
    },
    {
        path: '/register',
         component: () => import('../pages/login.vue')
    }, 
    {
        path: '/login', 
        component: () => import('../pages/login.vue')
    }, 
    {
        path: '/document',
         component: () => import('../pages/document.vue')
    }, 
    {
        path: '/knowledgeBase',
         component: () => import('../pages/knowledgeBase.vue')
    }
]

// 3. 创建路由实例
const router = createRouter({
    history: createWebHistory(), // 使用 HTML5 History 模式
    routes,
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') // 例：检查登录状态
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') // 跳转到登录页
  } else {
    next() // 放行
  }
})

export default router