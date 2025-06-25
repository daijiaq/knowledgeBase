import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createKBsApi, getAllKBsApi, getKBsContentApi, getKBsRecentApi } from "../api/knowledgeBase"
import type { createKnowledgeBaseRes, allKnowledgeBase } from "../types/knowledgeBase"
export const useKnowledgeBaseStore = defineStore('knowledgeBase', () => {
  // 创建知识库
  const createKBs = async (name: string, description: string): Promise<createKnowledgeBaseRes> => {
    const res = await createKBsApi(name, description)
    // 逻辑：将新建知识库push到knowledgeBaseList中，但是“创建知识库”接口没有返回字段permission，要么前端自行默认创建者为owner或者直接调用getAllKBs，要么后端增加返回字段，明天记得再看一下
    return res
  }

  // 获取所有知识库（获取可访问的知识库）
  const getAllKBs = async () => {
    const res = await getAllKBsApi()
    console.log(res);
   knowledgeBaseList.value = res.data
  }

  //点击某个知识库去往对应文档页面（同时记录最近访问）
  const openAndRecordRecentAccess = async (knowledgeBaseId: number) => {
      await getKBsContentApi(knowledgeBaseId)
  }

  // 获取最近访问的知识库
  const getRecentKBs = async (limit: number) => {
    const res = await getKBsRecentApi(limit)
    recentKBsList.value = res.data
  }
  // 知识库列表(目录树那边的所有知识库)
  const knowledgeBaseList = ref<allKnowledgeBase[]>([])
  // 最近访问的知识库列表
  const recentKBsList = ref([])
  // 模拟最近访问的知识库列表，后续改成使用recentKBsList
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
    knowledgeBaseList,
    cardList,
    recentKBsList,
    createKBs,
    getAllKBs,
    openAndRecordRecentAccess,
    getRecentKBs
  }
})
