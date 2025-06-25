/**
 * 创建知识库
 */
export interface createKnowledgeBaseRes {
    data: createKnowledgeBase
    message: string
    code: number
}

export interface createKnowledgeBase {
    /**
     * 知识库创建时间
     */
    createdAt: string;
    /**
     * 知识库描述
     */
    description: string;
    /**
     * 知识库id
     */
    id: number;
    /**
     * true表示文件可用
     */
    isActive: boolean;
    /**
     * 知识库名字
     */
    name: string;
    /**
     * 创建者id
     */
    ownerId: number;
    /**
     * 知识库更新时间
     */
    updatedAt: string;
}


/**
 * 获取所有知识库（获取可访问的知识库）
 */
export interface allKnowledgeBaseRes {
    data: allKnowledgeBase[]
    code: number
}
export interface allKnowledgeBase {
    /**
     * 知识库介绍
     */
    description: string;
    /**
     * 知识库id
     */
    id: number;
    /**
     * 知识库名称
     */
    name: string;
    /**
     * 所拥有的权限
     */
    permission: string;
}

/**
 * 根据知识库id获取第一层内部文档和文件夹
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
 * 获取最近访问的知识库
 */
