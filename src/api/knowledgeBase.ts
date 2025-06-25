import request from '../utils/request'
import type { createKnowledgeBaseRes, allKnowledgeBaseRes, KnowledgeBaseContentRes } from "../types/knowledgeBase"
// 创建知识库
export const createKBsApi = (name: string, description: string): Promise<createKnowledgeBaseRes> => {
    return request({
        url: `/knowledgeBase`,
        method: 'POST',
        data: {
            name,
            description
        }
    })
}
// 编辑知识库

// 删除知识库

// 获取所有知识库（获取可访问的知识库）
export const getAllKBsApi = (): Promise<allKnowledgeBaseRes> => {
    return request({
        url: `/knowledgeBase/accessible`,
        method: 'GET'
    })
}

// 根据知识库id获取第一层内部文档和文件夹（这个接口后台逻辑内部有更新知识库访问记录，点击某个知识库必须先调用该接口，后续调用“获取最近访问的知识库”接口才有数据）
export const getKBsContentApi = (knowledgeBaseId: number):Promise<KnowledgeBaseContentRes> => {
    return request({
        url: `/knowledgeBase/${knowledgeBaseId}/content`,
        method: 'GET'
    })
}

// 获取最近访问的知识库【类型定义因为接口原因还没写，明天记得补充】
export const getKBsRecentApi = (limit: number) => {
    return request({
        url: `/knowledgeBase/recent?limit=${limit}`,
        method: 'GET'
    })
}
