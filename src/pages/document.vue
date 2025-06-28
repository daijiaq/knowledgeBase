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
            <h3>{{ currentKnowledgeBaseInfo?.name }}</h3>
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

      <div class="sidebar-content" v-if="!sidebarCollapsed" @click="initParentId">
        <!-- 搜索框 -->
        <div class="search-box" @click.stop>
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
        <div class="toolbar" @click.stop="">
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
                <el-dropdown-item @click="shareDoc">添加协作</el-dropdown-item>
                <el-dropdown-item>导入文档</el-dropdown-item>
                <el-dropdown-item>导出知识库</el-dropdown-item>
                <el-dropdown-item>模板库</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 文档树 -->
        <div class="doc-tree" @click.stop>
          <!-- 文件夹 -->
          <FolderItem v-for="item in filteredDocs" :item="item"/>
          <!-- 文档 -->
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <template v-if="currentDocId!==null&&currentDocType=='document'">
      <CollaborativeEditor/>
      <Comment />
    </template>
    <div v-else style="width: 890px;padding: 20px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    background-color: white;">
      <div style="display: flex;justify-content: space-between;">
        <h1>{{ currentKnowledgeBaseInfo?.name }}</h1>
        <el-button @click="shareDoc">分享</el-button>
      </div>
      <p style="margin-top: 20px; font-size: 18px;">👋 欢迎来到知识库</p>
    </div>

    <!-- 新建文档对话框 -->
    <el-dialog v-model="showNewDocDialog" title="新建文档" width="400px">
      <el-form :model="newDocForm" label-width="80px">
        <el-form-item label="文档名称">
          <el-input v-model="newDocForm.name" placeholder="请输入文档名称" />
        </el-form-item>
        <el-form-item label="文档类型">
          <el-radio-group v-model="newDocForm.type">
            <el-radio label="document">文档</el-radio>
            <el-radio label="folder">文件夹</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showNewDocDialog = false">取消</el-button>
        <el-button type="primary" @click="createNewDoc">确定</el-button>
      </template>
    </el-dialog>

    <!-- 分享对话框 -->
    <el-dialog v-model="showShareDialog" title="分享知识库" width="400px">
      <div class="share-content">
        <div class="share-section">
          <h4>邀请协作者</h4>
          <div class="invite-form">
            <div style="width: 300px">
              <el-input
              v-model="inviteEmail"
              placeholder="输入邮箱地址"
              @input="searchInviteUser"
              />
              <div class="invite-list">
                <template v-if="search_list.length">
                  <div
                    v-for="item in search_list"
                    :key="item.id"
                    class="invite-user-item"
                    :class="{ checked: item.checked }"
                    @click="item.checked = !item.checked">
                    <span class="user-name" :title="item.username">{{ item.username }}</span>
                    <el-check-tag :checked="item.checked">{{ item.checked ? '已选' : '选择' }}</el-check-tag>
                  </div>
                </template>
                <div v-else class="no-user">无匹配用户</div>
              </div>
            </div>
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
import { ref, computed, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import CollaborativeEditor from "../components/CollaborativeEditor.vue";
import { userSearch } from "../api/user";
import * as KBsApi from "../api/knowledgeBase";
import * as folderApi from '../api/folder'
import type { userInfo,searchItem } from "../types/user";
import type{ FolderInfo } from "../types/knowledgeBase";
import FolderItem from "../components/FolderItem.vue";
import { useKnowledgeBaseStore } from "../stores/useKnowledgeBaseStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const route = useRoute();
const knowledgeBaseId = ref(Number(route.params.knowledgeBaseId))
//监听路由变化
watch(()=>route.params.knowledgeBaseId,(newValue)=>{
  knowledgeBaseId.value = Number(newValue)
  getKBsContent()
})

const knowledgeBaseStore =useKnowledgeBaseStore()
const {currentDocId,currentDocType} = storeToRefs(knowledgeBaseStore)
const {selectDoc,selectDocType} = knowledgeBaseStore

// 响应式数据
const sidebarCollapsed = ref(false);
const searchQuery = ref("");
const showNewDocDialog = ref(false);
const showShareDialog = ref(false);
//双击空白位置将parentId设置为null
const isClickDouble = ref(true)
function initParentId(){
  isClickDouble.value = !isClickDouble.value
  if(isClickDouble.value===true){
    selectDoc(null)
    selectDocType('folder')
  }
}

//打开分享界面
const shareDoc = ()=>{
  showShareDialog.value = true
}
//根据邮箱搜索用户
const tt = ref(0)
const search_list = ref<searchItem[]>([])
const searchInviteUser = (keyword:string)=>{
  tt.value&&clearTimeout(tt.value)
  tt.value = setTimeout(async ()=>{
    search_list.value = []
    if(keyword){
      const {data} = await userSearch(keyword,knowledgeBaseId.value)
      data.forEach((item:userInfo)=>{
        let checked = false
        search_list.value.push({
          ...item,
          checked
        })
      })
    }
  },500)
}

// 表单数据
const newDocForm = reactive(({
  name: "",
  type: "document",
  parentId: null,
}) as {
  name:string
  type:'document'|'folder'
  parentId:number|null
});

const inviteEmail = ref("");
const shareLink = ref("https://example.com/share/abc123");

//获取当前知识库下的内容
const rootFolders = ref<FolderInfo[]>()
const rootDoc = ref()
const currentKnowledgeBaseInfo = ref()
const getKBsContent = async()=>{
  try{
    const {data:{documents,folders,knowledgeBaseInfo}} = await KBsApi.getKBsContentApi(knowledgeBaseId.value)
    rootFolders.value = folders
    rootDoc.value = documents
    currentKnowledgeBaseInfo.value = knowledgeBaseInfo
  }catch(error){
    console.log('根据知识库id获取内容失败');
    ElMessage.error('无法获取知识库')
  }
}
getKBsContent()

const filteredDocs = computed(() => {
  if (!searchQuery.value) return rootFolders.value;
  return rootFolders.value?.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});


// 折叠侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const createNewDoc = async() => {
  try{
    if (!newDocForm.name.trim()) {
      ElMessage.error("请输入文档名称");
      return;
    }

    if (newDocForm.type === "document") {
      //创建文档
      //创建完后选中文档
    }else{
      //创建文件夹
      await folderApi.createFolderApi(knowledgeBaseId.value,newDocForm.name,currentDocId.value)
    }

    showNewDocDialog.value = false;
    newDocForm.name = "";
    newDocForm.type = "document";
    newDocForm.parentId = null
    ElMessage.success("创建成功");
    location.reload()
  }catch(error){
    console.log('创建文档或文件夹失败',error);
    ElMessage.error('创建失败')
  }
};

const sendInvite = async () => {
  try{
    const checkedUser:number[] = []
    search_list.value.filter(item=>item.checked===true).forEach((ele:searchItem)=>{
      checkedUser.push(ele.id)
    })
    if(Boolean(checkedUser)==false){
      ElMessage.error("请选择协作人");
      return
    }
    await Promise.all(checkedUser.map((id:number)=>{
      return KBsApi.inviteKBsCollaborator(id,knowledgeBaseId.value)//第二个参数是知识库id
    }))
    ElMessage.success("邀请已发送");
    inviteEmail.value = "";
    searchInviteUser(inviteEmail.value)
    showShareDialog.value = false
    getKBsContent()
  }catch(error){
    ElMessage.error("邀请失败");
  }
};

const copyShareLink = () => {
  navigator.clipboard.writeText(shareLink.value);
  ElMessage.success("链接已复制");
};
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
      align-items: flex-start;
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

//协作人搜索用户列表样式
.invite-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 10px 0 0 0;
  width: 100%;

  .invite-user-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    background: #f7f8fa;
    transition: background 0.2s;
    border: 1px solid transparent;

    &:hover {
      background: #fff;
      border-color: #409eff;
    }
    &.checked {
      border-color: #409eff;
      background-color: #fff;
    }

    .user-name {
      flex: 1;
      font-size: 14px;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 10px;
    }
    .el-check-tag {
      min-width: 40px;
      text-align: center;
    }
  }
  .no-user {
    color: #aaa;
    text-align: center;
    padding: 10px 0;
    font-size: 13px;
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
