/**
 * 创建知识库
 */
export interface createKnowledgeBaseRes {
  data: createKnowledgeBase;
  message: string;
  code: number;
}

export interface createKnowledgeBase {
  /**
   * 创建时间
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
   * 知识库是否可用
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
   * 更新时间
   */
  updatedAt: string;
}

/**
 * 获取所有知识库（获取可访问的知识库）
 */
export interface allKnowledgeBaseRes {
  data: allKnowledgeBase[];
  code: number;
  message: string;
}
export interface allKnowledgeBase {
  /**
   * 描述
   */
  description: string;
  /**
   * 知识库id
   */
  id: number;
  /**
   * 知识库名字
   */
  name: string;
  /**
   * 权限
   */
  permission: string;
}

/**
 * 文件夹信息
 */
export interface FolderInfo {
  id: number;
  name: string;
}

export interface DocumentInfo {
  id: number;
  title: string;
}

export interface KnowledgeBaseContent {
  folders: FolderInfo[];
  documents: DocumentInfo[];
  knowledgeBaseInfo: {
    id: number;
    name: string;
    desc: string;
    collaborators: number[];
  };
}

export interface KnowledgeBaseContentRes {
  code: number;
  message: string;
  data: KnowledgeBaseContent;
}

/**
 * 根据知识库id获取所有文档id
 */
export interface KnowledgeBaseAllDocumentIdsRes {
  code: number;
  data: KnowledgeBaseAllDocumentIds;
  message: string;
}

export interface KnowledgeBaseAllDocumentIds {
  documentIds: number[];
  knowledgeBaseId: string;
  totalCount: number;
}
