import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useKnowledgeBaseStore = defineStore('knowledgeBase', () => {
  // 模拟知识库数据 调接口时再改
const cardList = ref([
  {
    title: '前端知识库',
    description: '这是文化知识库的描述的v拿到了...',
    docCount: 15,
    updateTime: '2025-06-21'
  },
  {
    title: '后台知识库',
    description: '这是文化知识库的描述',
    docCount: 15,
    updateTime: '2025-06-21'
  },
  {
    title: '安卓知识库',
    description: '这是文化知识是那些卡死才把...',
    docCount: 15,
    updateTime: '2025-06-21'
  },
    {
    title: '安卓知识库',
    description: '这是文化知识是那些卡死才把...',
    docCount: 15,
    updateTime: '2025-06-21'
  }

])


  return {
    cardList
 }
})
