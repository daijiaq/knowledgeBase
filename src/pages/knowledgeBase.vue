<script setup lang="ts">
import {
  ArrowDown,
  Location,
  Folder,
  Reading,
} from "@element-plus/icons-vue";

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header
        class="header"
        height="65px"
      >
        <div class="header-logo">知识库系统</div>
        <div class="header-userInfo">
          <el-dropdown>
            <span class="user-dropdown">
              测试用户
              <el-icon><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>退出登录</el-dropdown-item>
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
          > <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <Reading />
                </el-icon>
                <span>知识库</span>
              </template>
              <el-menu-item index="1-1">
               <el-icon><Folder /></el-icon>
                <span>历史</span>
              </el-menu-item>
              <el-menu-item index="1-2">
              <el-icon><Folder /></el-icon>
                <span>科技</span>
              </el-menu-item>
              <el-menu-item index="1-3">
             <el-icon><Folder /></el-icon>
                <span>文化</span>
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
    height: 100%;
  }
  .aside {
    border-right: 1px solid #f3f4f6;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }
  :deep(.el-main) {
    padding: 0 !important; 
  }

}
</style>
