/**
 * ����֪ʶ��
 */
export interface createKnowledgeBaseRes {
    data: createKnowledgeBase
    message: string
    code: number
}

export interface createKnowledgeBase {
    /**
     * ֪ʶ�ⴴ��ʱ��
     */
    createdAt: string;
    /**
     * ֪ʶ������
     */
    description: string;
    /**
     * ֪ʶ��id
     */
    id: number;
    /**
     * true��ʾ�ļ�����
     */
    isActive: boolean;
    /**
     * ֪ʶ������
     */
    name: string;
    /**
     * ������id
     */
    ownerId: number;
    /**
     * ֪ʶ�����ʱ��
     */
    updatedAt: string;
}


/**
 * ��ȡ����֪ʶ�⣨��ȡ�ɷ��ʵ�֪ʶ�⣩
 */
export interface allKnowledgeBaseRes {
    data: allKnowledgeBase[]
    code: number
}
export interface allKnowledgeBase {
    /**
     * ֪ʶ�����
     */
    description: string;
    /**
     * ֪ʶ��id
     */
    id: number;
    /**
     * ֪ʶ������
     */
    name: string;
    /**
     * ��ӵ�е�Ȩ��
     */
    permission: string;
}

/**
 * ����֪ʶ��id��ȡ��һ���ڲ��ĵ����ļ���
 */
export interface FolderItem {
  id: string
  name: string
}

export interface DocumentItem {
  id: string
  title: string
}

export interface KnowledgeBaseContent {
  folders: FolderItem[]
  documents: DocumentItem[]
}

export interface KnowledgeBaseContentRes {
  code: number
  message: string
  data: KnowledgeBaseContent | null
}

/**
 * ��ȡ������ʵ�֪ʶ��
 */
