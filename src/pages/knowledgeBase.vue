<script setup lang="ts">
import {
  ArrowDown,
  Folder,
  Reading,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router'
import {useUserStore} from "../stores/useUserStore"
import { useKnowledgeBaseStore } from "../stores/useKnowledgeBaseStore";
import { onMounted } from "vue";
const router = useRouter()
const userStore = useUserStore()
const {logined,username} = useUserStore()
const knowledgeBaseStore = useKnowledgeBaseStore()
const handleOpen = (key: string, keyPath: string[]) => {
  console.log('打开');
  
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log('折叠');
  
};

const logOut = ()=>{
  localStorage.removeItem("token")
  userStore.logined = false
  ElMessage.success("已退出登录")
  router.push('/login')
}
// 获取所有知识库（获取可访问的知识库）
onMounted(async()=>{
  await knowledgeBaseStore.getAllKBs()
})

const goToDocument = async (knowledgeBaseId: number)=>{
  router.push('/knowledgeBase/knowledgeBaseMain')
  await knowledgeBaseStore.openAndRecordRecentAccess(knowledgeBaseId)
}
</script>

<template>
  <div class="common-layout">
    <el-container style="height: 100%;">
      <el-header
        class="header"
        height="65px"
      >
        <div class="header-logo" @click="router.replace('/knowledgeBase/knowledgeBaseMain')" >知识库系统</div>
        <div class="header-userInfo">
          <el-dropdown>
            <span class="user-dropdown">
              {{ username }}
              <el-icon><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside
          width="200px"
          class="aside"
        >
          <el-menu
            default-active=""
            class="menu"
            @open="handleOpen"
            @close="handleClose"
            active-text-color="rgba(140, 122, 230)"
            router
          > <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <Reading />
                </el-icon>
                <span>知识库</span>
              </template>
            <el-menu-item
                v-for="(item, index) in knowledgeBaseStore.knowledgeBaseList"
                :key="item.id"
                :index="`1-${index + 1}`"
                @click="goToDocument(item.id)"
              >
                <el-icon><Folder /></el-icon>
                <span>{{ item.name }}</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<style scoped lang="scss">
.common-layout {
  height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    border-bottom: 1px solid #f3f4f6;
    .header-logo {
      cursor: pointer;
      font-size: 24px;
      font-weight: bold;
      // 文字颜色渐变
      background: linear-gradient(
        135deg,
        var(--primary-color),
        var(--primary-light)
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      &::before {
        content: "📚";
        font-size: 28px;
        margin-right: 10px;
        -webkit-text-fill-color: initial; /* 取消之前的透明文本设置*/
      }
    }
    .header-userInfo {
      display: flex;
      align-items: center;
      .user-dropdown {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-weight: bold;
        border-radius: 35px;
        padding: 8px 16px;
        outline: none;
        transition: all 0.3s ease;
        .el-icon {
          margin-left: 5px;
          transition: transform 0.3s ease;
        }
        &:hover {
          background-color: #f3f4f6;
          transform: translateY(-1px);
        }
        &:hover .el-icon {
          transform: rotate(180deg);
        }
      }
    }
  }
  .el-container {
    height: calc(100vh - 65px);
  }
  .aside {
    border-right: 1px solid #f3f4f6;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }
  .main{
    height: 100%;
  }
  :deep(.el-main) {
    padding: 0 !important; 
  }

}
</style>
