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
    message: string
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
export interface FolderInfo {
  id: string
  name: string
}

export interface DocumentInfo {
  id: string
  title: string
}

export interface KnowledgeBaseContent {
  folders: FolderInfo[]
  documents: DocumentInfo[]
  knowledgeBaseInfo:{
    id:number,
    name:string,
    desc:string,
    collaborators:number[]
  }
}

export interface KnowledgeBaseContentRes {
  code: number
  message: string
  data: KnowledgeBaseContent
}

/**
 * ��ȡ������ʵ�֪ʶ�⡪�����������ͻ�ȡ����֪ʶ�⣨��ȡ�ɷ��ʵ�֪ʶ�⣩һ��
 */
