import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { ElMessage } from "element-plus";
import { getKBsAllDocumentIdsApi } from "../api/knowledgeBase";
import { debounce } from "./debounce";

// 缓存接口返回的文档ID列表，避免重复请求
const documentIdsCache = new Map<
  number,
  {
    documentIds: number[];
    timestamp: number;
  }
>();

// 缓存过期时间 (5分钟)
const CACHE_EXPIRE_TIME = 5 * 60 * 1000;

/**
 * 获取知识库下所有文档ID，带缓存优化
 * @param knowledgeBaseId 知识库ID
 * @returns 文档ID数组
 */
async function getDocumentIds(knowledgeBaseId: number): Promise<number[]> {
  const now = Date.now();
  const cached = documentIdsCache.get(knowledgeBaseId);

  // 检查缓存是否有效
  if (cached && now - cached.timestamp < CACHE_EXPIRE_TIME) {
    return cached.documentIds;
  }

  try {
    const response = await getKBsAllDocumentIdsApi(knowledgeBaseId);
    const documentIds = response.data.documentIds;

    // 更新缓存
    documentIdsCache.set(knowledgeBaseId, {
      documentIds,
      timestamp: now,
    });

    return documentIds;
  } catch (error) {
    console.error("获取文档ID列表失败:", error);
    throw error;
  }
}

/**
 * 验证文档是否属于指定知识库
 * @param knowledgeBaseId 知识库ID
 * @param documentId 文档ID
 * @returns 是否有权限访问
 */
async function validateDocumentAccess(
  knowledgeBaseId: number,
  documentId: number
): Promise<boolean> {
  try {
    const documentIds = await getDocumentIds(knowledgeBaseId);
    return documentIds.includes(documentId);
  } catch (error) {
    // 接口请求失败时的降级策略：默认拒绝访问
    return false;
  }
}

// 使用防抖优化的验证函数，避免用户频繁修改URL触发多次请求
const debouncedValidateDocumentAccess = debounce(validateDocumentAccess, 300);

/**
 * 文档访问权限路由守卫
 * @param to 目标路由
 * @param from 来源路由
 * @param next 导航守卫回调
 */
export async function documentAuthGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const knowledgeBaseId = Number(to.params.knowledgeBaseId);
  const documentId = Number(to.params.documentId);

  // 参数验证
  if (
    !knowledgeBaseId ||
    !documentId ||
    isNaN(knowledgeBaseId) ||
    isNaN(documentId)
  ) {
    ElMessage.error("无效的访问参数");
    next("/knowledgeBase/KnowledgeBaseMain");
    return;
  }

  try {
    // 验证文档是否属于当前知识库
    const hasAccess = await validateDocumentAccess(knowledgeBaseId, documentId);

    if (hasAccess) {
      // 有权限，允许访问，确保正确渲染文档内容和侧边栏状态
      next();
    } else {
      // 无权限：页面无跳转，仅弹窗提示，其他内容保持不变
      ElMessage.error("该文档不属于本知识库");
      // 重定向回原路由，保持页面状态不变
      // const currentPath = from.fullPath || `/knowledgeBase/${knowledgeBaseId}`;
      // next(currentPath);
      console.log(knowledgeBaseId);
      next(`/knowledgeBase/KnowledgeBaseMain/${knowledgeBaseId}`);
    }
  } catch (error) {
    // 网络错误等异常情况的处理
    console.error("文档权限验证失败:", error);
    ElMessage.error("网络错误，无法验证文档权限");
    // 网络错误时也保持当前页面不变
    // const currentPath = from.fullPath || `/knowledgeBase/${knowledgeBaseId}`;
    // next(currentPath);
    next(`/knowledgeBase/KnowledgeBaseMain/${knowledgeBaseId}`);
  }
}

/**
 * 清除指定知识库的缓存
 * @param knowledgeBaseId 知识库ID
 */
export function clearDocumentIdsCache(knowledgeBaseId?: number) {
  if (knowledgeBaseId) {
    documentIdsCache.delete(knowledgeBaseId);
  } else {
    documentIdsCache.clear();
  }
}

/**
 * 手动更新缓存（用于创建、删除文档后的缓存同步）
 * @param knowledgeBaseId 知识库ID
 * @param documentIds 最新的文档ID列表
 */
export function updateDocumentIdsCache(
  knowledgeBaseId: number,
  documentIds: number[]
) {
  documentIdsCache.set(knowledgeBaseId, {
    documentIds,
    timestamp: Date.now(),
  });
}
