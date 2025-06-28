import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createKBsApi, getAllKBsApi,  getKBsRecentApi } from "../api/knowledgeBase"
import {getFolderContentApi} from '../api/folder'
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


  // 获取最近访问的知识库
  const getRecentKBs = async (limit: number) => {
    const res = await getKBsRecentApi(limit)
    recentKBsList.value = res.data
  }

  //当前选中的文档或文件夹
  const currentDocId = ref<null|number>(null)
  const currentDocType = ref<'document'|'folder'>()
  const storageId = localStorage.getItem('currentDocId')
  const storageType = localStorage.getItem('currentDocType')
  currentDocId.value = storageId!=undefined&&storageId!='null'?Number(storageId):null
  currentDocType.value = storageType=='folder'||storageType=='document'?storageType:'folder'

  //更新当前选中的文档
  const selectDoc = (docId:number|null)=>{
    currentDocId.value = docId
    localStorage.setItem('currentDocId',String(currentDocId.value))
  }
  const selectDocType = (type:'document'|'folder')=>{
    currentDocType.value = type
    localStorage.setItem('currentDocType',currentDocType.value)
  }

  //获取文件夹里面内容
  async function getFolderContent(folderId:number){
    const res = await getFolderContentApi(folderId)
    return res.data
  }


  return {
    knowledgeBaseList,
    recentKBsList,
    createKBs,
    getAllKBs,
    getRecentKBs,
    currentDocId,
    currentDocType,
    selectDoc,
    selectDocType,
    getFolderContent
  }
})
