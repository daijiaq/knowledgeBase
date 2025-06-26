import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createKBsApi, getAllKBsApi, getKBsContentApi, getKBsRecentApi } from "../api/knowledgeBase"
import type { createKnowledgeBaseRes, allKnowledgeBase } from "../types/knowledgeBase"
export const useKnowledgeBaseStore = defineStore('knowledgeBase', () => {
  // 知识库列表(目录树那边的所有知识库)
  const knowledgeBaseList = ref<allKnowledgeBase[]>([])
  // 最近访问的知识库列表
  const recentKBsList = ref<allKnowledgeBase[]>([]);
  
  // 创建知识库
  const createKBs = async (name: string, description: string): Promise<createKnowledgeBaseRes> => {
    const res = await createKBsApi(name, description)
      const newKnowledgeBase = {
    id: res.data.id, 
    name: name,
    description: description,
    permission: 'owner',
  };
  knowledgeBaseList.value.push(newKnowledgeBase);
    return res
  }

  // 获取所有知识库（获取可访问的知识库）
  const getAllKBs = async () => {
    const res = await getAllKBsApi()
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


  return {
    knowledgeBaseList,
    recentKBsList,
    createKBs,
    getAllKBs,
    openAndRecordRecentAccess,
    getRecentKBs
  }
})
