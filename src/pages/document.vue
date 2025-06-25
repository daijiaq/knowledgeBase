<template>
  <div class="document-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="kb-info" v-if="!sidebarCollapsed">
          <div class="kb-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </div>
          <div class="kb-details">
            <h3>前端开发指南</h3>
            <p>15 篇文档</p>
          </div>
        </div>
        <el-button @click="toggleSidebar" type="text" class="collapse-btn">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </el-button>
      </div>

      <div class="sidebar-content" v-if="!sidebarCollapsed">
        <!-- 搜索框 -->
        <div class="search-box">
          <svg
            class="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
              stroke="currentColor"
              stroke-width="2"
            />
            <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" />
          </svg>
          <input type="text" placeholder="搜索文档..." v-model="searchQuery" />
        </div>

        <!-- 工具栏 -->
        <div class="toolbar">
          <el-button
            @click="showNewDocDialog = true"
            type="primary"
            size="small"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
                stroke="currentColor"
                stroke-width="2"
              />
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            新建
          </el-button>
          <el-dropdown>
            <el-button size="small">
              更多
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline
                  points="6,9 12,15 18,9"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>导入文档</el-dropdown-item>
                <el-dropdown-item>导出知识库</el-dropdown-item>
                <el-dropdown-item>模板库</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 文档树 -->
        <div class="doc-tree">
          <div
            v-for="item in filteredDocs"
            :key="item.id"
            class="doc-item"
            :class="{ active: currentDocId === item.id }"
            @click="selectDoc(item)"
          >
            <div class="doc-icon">
              <svg
                v-if="item.type === 'folder'"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <polyline
                  points="14,2 14,8 20,8"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>
            <span class="doc-title">{{ item.title }}</span>
            <div class="doc-actions">
              <el-dropdown trigger="click" @click.stop>
                <el-button type="text" size="small">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                    <circle cx="12" cy="5" r="1" fill="currentColor" />
                    <circle cx="12" cy="19" r="1" fill="currentColor" />
                  </svg>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>重命名</el-dropdown-item>
                    <el-dropdown-item>复制</el-dropdown-item>
                    <el-dropdown-item>移动</el-dropdown-item>
                    <el-dropdown-item class="danger">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <CollaborativeEditor :shareDoc="shareDoc"/>
    <Comment />

    <!-- 新建文档对话框 -->
    <el-dialog v-model="showNewDocDialog" title="新建文档" width="400px">
      <el-form :model="newDocForm" label-width="80px">
        <el-form-item label="文档名称">
          <el-input v-model="newDocForm.title" placeholder="请输入文档名称" />
        </el-form-item>
        <el-form-item label="文档类型">
          <el-radio-group v-model="newDocForm.type">
            <el-radio label="document">文档</el-radio>
            <el-radio label="folder">文件夹</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="父级目录">
          <el-select v-model="newDocForm.parentId" placeholder="选择父级目录">
            <el-option label="根目录" :value="0" />
            <el-option
              v-for="folder in folders"
              :key="folder.id"
              :label="folder.title"
              :value="folder.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showNewDocDialog = false">取消</el-button>
        <el-button type="primary" @click="createNewDoc">确定</el-button>
      </template>
    </el-dialog>

    <!-- 分享对话框 -->
    <el-dialog v-model="showShareDialog" title="分享文档" width="500px">
      <div class="share-content">
        <div class="share-section">
          <h4>邀请协作者</h4>
          <div class="invite-form">
            <el-input
              v-model="inviteEmail"
              placeholder="输入邮箱地址"
              style="width: 300px"
            />
            <el-select
              v-model="invitePermission"
              style="width: 120px; margin-left: 10px"
            >
              <el-option label="查看" value="view" />
              <el-option label="评论" value="comment" />
              <el-option label="编辑" value="edit" />
            </el-select>
            <el-button
              type="primary"
              @click="sendInvite"
              style="margin-left: 10px"
              >邀请</el-button
            >
          </div>
        </div>
        <div class="share-section">
          <h4>分享链接</h4>
          <div class="share-link">
            <el-input v-model="shareLink" readonly />
            <el-button @click="copyShareLink">复制链接</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import CollaborativeEditor from "../components/CollaborativeEditor.vue";

const router = useRouter();
const route = useRoute();
console.log('知识库id',route.params.knowledgeBaseId);
console.log('文档id',route.params.documentId);


// 响应式数据
const sidebarCollapsed = ref(false);
const searchQuery = ref("");
const currentDocId = ref(1);
const showNewDocDialog = ref(false);
const showShareDialog = ref(false);

//打开分享界面
const shareDoc = ()=>{
  showShareDialog.value = true
}

// 表单数据
const newDocForm = reactive({
  title: "",
  type: "document",
  parentId: 0,
});

const inviteEmail = ref("");
const invitePermission = ref("view");
const shareLink = ref("https://example.com/share/abc123");

// 编辑器引用
const editorRef = ref<HTMLTextAreaElement>();

// 模拟数据
const documents = ref([
  {
    id: 1,
    title: "快速开始",
    type: "document",
    parentId: 0,
    content: "# 快速开始\n\n这是一个示例文档...",
  },
  { id: 2, title: "Vue 基础", type: "folder", parentId: 0 },
  {
    id: 3,
    title: "组件开发",
    type: "document",
    parentId: 2,
    content: "# 组件开发\n\n学习如何开发Vue组件...",
  },
  {
    id: 4,
    title: "状态管理",
    type: "document",
    parentId: 2,
    content: "# 状态管理\n\nVuex和Pinia的使用...",
  },
  { id: 5, title: "项目实战", type: "folder", parentId: 0 },
]);

// 找当前文档
const currentDoc = computed(() => {
  return documents.value.find((doc) => doc.id === currentDocId.value);
});

const filteredDocs = computed(() => {
  if (!searchQuery.value) return documents.value;
  return documents.value.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const folders = computed(() => {
  return documents.value.filter((doc) => doc.type === "folder");
});


// 方法
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const goBack = () => {
  router.push("/home/knowledge");
};

const selectDoc = (doc: any) => {
  currentDocId.value = doc.id;
  
};

const createNewDoc = () => {
  if (!newDocForm.title.trim()) {
    ElMessage.error("请输入文档名称");
    return;
  }

  const newDoc = {
    id: Date.now(),
    title: newDocForm.title,
    type: newDocForm.type,
    parentId: newDocForm.parentId,
    content:
      newDocForm.type === "document"
        ? "# " + newDocForm.title + "\n\n"
        : undefined,
  };

  documents.value.push(newDoc);

  if (newDocForm.type === "document") {
    selectDoc(newDoc);
  }

  showNewDocDialog.value = false;
  newDocForm.title = "";
  newDocForm.type = "document";
  newDocForm.parentId = 0;

  ElMessage.success("创建成功");
};

const sendInvite = () => {
  if (!inviteEmail.value.trim()) {
    ElMessage.error("请输入邮箱地址");
    return;
  }

  ElMessage.success("邀请已发送");
  inviteEmail.value = "";
};

const copyShareLink = () => {
  navigator.clipboard.writeText(shareLink.value);
  ElMessage.success("链接已复制");
};

onMounted(() => {
  // 根据路由参数设置当前文档
  const docId = route.params.id;
  if (docId) {
    const doc = documents.value.find((d) => d.id === Number(docId));
    if (doc) {
      selectDoc(doc);
    }
  }

  // 聚焦编辑器
  nextTick(() => {
    editorRef.value?.focus();
  });
});
</script>

<style scoped lang="scss">
.document-container {
  display: flex;
  height: 100%;
  background: var(--background-color);
}

.sidebar {
  width: 300px;
  background: var(--background-white);
  border-right: 1px solid var(--border-color-light);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &.collapsed {
    width: 60px;
  }

  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid var(--border-color-light);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .kb-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;

      .kb-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(
          135deg,
          var(--primary-color),
          var(--primary-light)
        );
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          width: 20px;
          height: 20px;
          color: white;
        }
      }

      .kb-details {
        h3 {
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-color);
        }

        p {
          margin: 0;
          font-size: 12px;
          color: var(--text-color-secondary);
        }
      }
    }

    .collapse-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-color-secondary);

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }

  .sidebar-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;

    .search-box {
      position: relative;
      margin-bottom: 16px;

      .search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        color: var(--text-color-light);
      }

      input {
        width: 100%;
        height: 36px;
        padding: 0 12px 0 36px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        font-size: 14px;
        background: var(--background-color);

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }
    }

    .toolbar {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;

      .el-button {
        flex: 1;
        height: 32px;
        font-size: 12px;

        svg {
          width: 14px;
          height: 14px;
          margin-right: 4px;
        }
      }
    }

    .doc-tree {
      .doc-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 2px;

        &:hover {
          background: var(--background-color);
        }

        &.active {
          background: var(--primary-color);
          color: white;

          .doc-icon svg {
            color: white;
          }
        }

        .doc-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;

          svg {
            width: 100%;
            height: 100%;
            color: var(--text-color-secondary);
          }
        }

        .doc-title {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
        }

        .doc-actions {
          opacity: 0;
          transition: opacity 0.2s ease;

          .el-button {
            width: 20px;
            height: 20px;
            padding: 0;

            svg {
              width: 12px;
              height: 12px;
            }
          }
        }

        &:hover .doc-actions {
          opacity: 1;
        }
      }
    }
  }
}

// 对话框样式
.share-content {
  .share-section {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 12px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-color);
    }

    .invite-form {
      display: flex;
      align-items: center;
    }

    .share-link {
      display: flex;
      gap: 8px;

      .el-input {
        flex: 1;
      }
    }
  }
}

// 下拉菜单样式
:deep(.el-dropdown-menu) {
  .el-dropdown-menu__item {
    &.danger {
      color: var(--danger-color);

      &:hover {
        background: rgba(239, 68, 68, 0.1);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    z-index: 1000;
    height: 100%;

    &.collapsed {
      transform: translateX(-100%);
    }
  }

  .editor-area {
    flex-direction: column;

    .editor-panel,
    .preview-panel {
      &.half-width {
        flex: 1;
      }
    }
  }
}
</style>
