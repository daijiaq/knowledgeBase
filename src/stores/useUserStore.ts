import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
  // ÊÇ·ñÒÑµÇÂ¼
  const logined = ref(false)

  return {
    logined
 }
})
