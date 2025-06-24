import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
  // 是否登录
  const logined = ref(false)
  const username = ref('用户1234')

  return {
    logined,
    username
 }
})
