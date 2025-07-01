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
    if (typeof window === 'undefined') {
      return
    }
    const res = await getAllKBsApi()
    knowledgeBaseList.value = res.data
  }

  // 获取最近访问的知识库
  const getRecentKBs = async (limit: number) => {
    if (typeof window === 'undefined') {
      return
    }
    const res = await getKBsRecentApi(limit)
    recentKBsList.value = res.data
  }

  //当前选中的文档或文件夹
  const currentDocId = ref<null|number>(null)
  const selectDocId = ref<null|number>(null)//展示文档
  const currentDocType = ref<'document'|'folder'>('folder')
  let storageId: string | null = null
  let storageType: string | null = null
  if (typeof window !== 'undefined') {
    storageId = sessionStorage.getItem('currentDocId')
    storageType = sessionStorage.getItem('currentDocType')
    if(storageType==='document' && storageId!=null){selectDocId.value = Number(storageId)}
  }
  currentDocId.value = storageId!=undefined&&storageId!='null'?Number(storageId):null
  currentDocType.value = storageType=='folder'||storageType=='document'?storageType:'folder'

  //更新当前选中的文档
  const selectDoc = (docId:number|null)=>{
    currentDocId.value = docId
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('currentDocId',String(currentDocId.value))
    }
    if(currentDocType.value === 'document'){selectDocId.value = docId}  
  }
  const changKBs = ()=>{
    currentDocId.value = null
    selectDocId.value = null
    currentDocType.value = 'folder'
  }
  const selectDocType = (type:'document'|'folder')=>{
    currentDocType.value = type
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('currentDocType',currentDocType.value)
    }
  }

  //获取文件夹里面内容
  async function getFolderContent(folderId:number){
    if (typeof window === 'undefined') {
      return { folders: [], documents: [] }
    }
    const res = await getFolderContentApi(folderId)
    return res.data
  }

  // SSR: 支持服务端注入数据
  function setState(state: Partial<{
    knowledgeBaseList: allKnowledgeBase[]
    recentKBsList: allKnowledgeBase[]
    currentDocId: number | null
    currentDocType: 'document' | 'folder' | undefined
    knowledgeBaseContent: any // SSR 注入知识库页面内容
  }>) {
    if (state.knowledgeBaseList) knowledgeBaseList.value = state.knowledgeBaseList
    if (state.recentKBsList) recentKBsList.value = state.recentKBsList
    if (state.currentDocId !== undefined) currentDocId.value = state.currentDocId
    if (state.currentDocType !== undefined) currentDocType.value = state.currentDocType
    if (state.knowledgeBaseContent !== undefined) knowledgeBaseContent.value = state.knowledgeBaseContent
  }

  // SSR: 知识库页面内容
  const knowledgeBaseContent = ref<any>(null)

  return {
    knowledgeBaseList,
    recentKBsList,
    createKBs,
    getAllKBs,
    getRecentKBs,
    currentDocId,
    changKBs,
    selectDocId,
    currentDocType,
    selectDoc,
    selectDocType,
    getFolderContent,
    setState, // SSR 注入
    knowledgeBaseContent // SSR 注入
  }
})
