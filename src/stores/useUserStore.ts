import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
  // �Ƿ��ѵ�¼
  const logined = ref(false)

  return {
    logined
 }
})
