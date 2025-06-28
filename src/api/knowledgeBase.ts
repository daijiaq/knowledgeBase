import request from '../utils/request'
import type { createKnowledgeBaseRes, allKnowledgeBaseRes, KnowledgeBaseContentRes } from "../types/knowledgeBase"
// ����֪ʶ��
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
// �༭֪ʶ��
export const editKBsApi = (id: number, name: string, description: string) => {
    return request({
        url: `/knowledgeBase/${id}`,
        method: 'PUT',
        data: {
            name,
            description
        }
    })
}

// ɾ��֪ʶ��
export const deleteKBsApi = (id: number) => {
    return request({
        url: `/knowledgeBase/${id}`,
        method: 'DELETE'
    })
}

// ��ȡ����֪ʶ�⣨��ȡ�ɷ��ʵ�֪ʶ�⣩
export const getAllKBsApi = (): Promise<allKnowledgeBaseRes> => {
    return request({
        url: `/knowledgeBase/accessible`,
        method: 'GET'
    })
}


// ����֪ʶ��id��ȡ֪ʶ����Ϣ����һ���ڲ��ĵ����ļ��У�����ӿں�̨�߼��ڲ��и���֪ʶ����ʼ�¼�����ĳ��֪ʶ������ȵ��øýӿڣ���������"��ȡ������ʵ�֪ʶ��"�ӿڲ������ݣ�
export const getKBsContentApi = (knowledgeBaseId: number): Promise<KnowledgeBaseContentRes> => {
    return request({
        url: `/knowledgeBase/${knowledgeBaseId}/content`,
        method: 'GET'
    })
}

// ��ȡ������ʵ�֪ʶ��
export const getKBsRecentApi = (limit?: number):Promise<allKnowledgeBaseRes> => {
    const finalLimit = limit ?? 5
    return request({
        url: `/knowledgeBase/recent?limit=${finalLimit}`,
        method: 'GET'
    })
}

// ����Э����
export const inviteKBsCollaborator = (userId:number,knowledgeBaseId:number)=>{
    return request({
        url:'/knowledgeBase/invite',
        method:'POST',
        data:{
            userId,
            knowledgeBaseId,
            permission: "write"
          }
    })
}