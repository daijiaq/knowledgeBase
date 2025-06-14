import { createRouter, createWebHistory } from 'vue-router'

//����·�ɹ���
const routes = [
    {
        path: '/', 
         component: () => import('../pages/register.vue')
    },
    {
        path: '/register',
         component: () => import('../pages/register.vue')
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

// 3. ����·��ʵ��
const router = createRouter({
    history: createWebHistory(), // ʹ�� HTML5 History ģʽ
    routes,
})

// ȫ��ǰ������
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') // ��������¼״̬
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') // ��ת����¼ҳ
  } else {
    next() // ����
  }
})

export default router