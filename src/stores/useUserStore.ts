import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
  // 是否登录
  const logined = ref(false)

  return {
    logined
 }
})
