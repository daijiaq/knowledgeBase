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

// ɾ��֪ʶ��

// ��ȡ����֪ʶ�⣨��ȡ�ɷ��ʵ�֪ʶ�⣩
export const getAllKBsApi = (): Promise<allKnowledgeBaseRes> => {
    return request({
        url: `/knowledgeBase/accessible`,
        method: 'GET'
    })
}

// ����֪ʶ��id��ȡ��һ���ڲ��ĵ����ļ��У�����ӿں�̨�߼��ڲ��и���֪ʶ����ʼ�¼�����ĳ��֪ʶ������ȵ��øýӿڣ��������á���ȡ������ʵ�֪ʶ�⡱�ӿڲ������ݣ�
export const getKBsContentApi = (knowledgeBaseId: number):Promise<KnowledgeBaseContentRes> => {
    return request({
        url: `/knowledgeBase/${knowledgeBaseId}/content`,
        method: 'GET'
    })
}

// ��ȡ������ʵ�֪ʶ�⡾���Ͷ�����Ϊ�ӿ�ԭ��ûд������ǵò��䡿
export const getKBsRecentApi = (limit: number) => {
    return request({
        url: `/knowledgeBase/recent?limit=${limit}`,
        method: 'GET'
    })
}
