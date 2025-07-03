<script setup lang="ts">
import { ArrowDown, Folder, Reading } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../stores/useUserStore";
import { useKnowledgeBaseStore } from "../stores/useKnowledgeBaseStore";
import { onMounted, ref, reactive, watch } from "vue";
import MoreActions from "../components/MoreActions.vue";
import { deleteKBsApi, editKBsApi } from "../api/knowledgeBase";
import { ElMessage, ElMessageBox } from "element-plus";
import { storeToRefs } from "pinia";
const knowledgeBaseStore = useKnowledgeBaseStore();
interface KnowledgeBaseCard {
  id: number;
  name: string;
  description: string;
}
// 最近访问列表
const { getRecentKBs, changKBs, getAllKBs } = knowledgeBaseStore;
const { recentKBsList } = storeToRefs(knowledgeBaseStore) as {
  recentKBsList: import("vue").Ref<KnowledgeBaseCard[]>;
};
//所有知识库列表
const { knowledgeBaseList } = storeToRefs(knowledgeBaseStore) as {
  knowledgeBaseList: import("vue").Ref<KnowledgeBaseCard[]>;
};
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const username =
  typeof window !== "undefined"
    ? sessionStorage.getItem("username") || "用户"
    : "用户";
//当前打开的menu
const getMenuId = (id: string | string[] | undefined): string => {
  if (Array.isArray(id)) {
    return id[0] ?? "";
  }
  return id ?? "";
};
const activeMenu = ref(getMenuId(route.params.knowledgeBaseId));
watch(
  () => route.params.knowledgeBaseId,
  (newValue) => {
    activeMenu.value = getMenuId(newValue);
    changKBs();
  }
);
/* watch(()=>route.path,()=>{
  console.log(route.path);
  changKBs()
}) */
const handleOpen = () => {
  console.log("打开");
};
const handleClose = () => {
  console.log("折叠");
};

const logOut = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("token");
  }
  userStore.logined = false;
  ElMessage.success("已退出登录");
  router.replace("/login");
};
// // 获取所有知识库（获取可访问的知识库）ssR时会调用所以不用onMounted
//  onMounted(async()=>{
//    await knowledgeBaseStore.getAllKBs()
//    await knowledgeBaseStore.getRecentKBs(5)
//  })

const dialogFormVisible = ref(false);
const editingId = ref<number | null>(null);
const form = reactive({
  name: "",
  desc: "",
});
//编辑
function openEditDialog(id: number) {
  console.log("父组件收到编辑事件，id:", id); // 测试用
  const kb = knowledgeBaseStore.knowledgeBaseList.find(
    (item) => item.id === id
  );
  if (kb) {
    editingId.value = id;
    form.name = kb.name;
    form.desc = kb.description;
    dialogFormVisible.value = true;
  }
}

// 提交编辑
async function submitForm() {
  if (!editingId.value) return;
  await editKBsApi(editingId.value, form.name, form.desc);
  ElMessage.success("编辑成功");
  dialogFormVisible.value = false;

  if (route.path === `/knowledgeBase/KnowledgeBaseMain`) {
    // 更新知识库列表
    if (typeof window !== "undefined") {
      await knowledgeBaseStore.getAllKBs();
      await getRecentKBs(5);
    }
  } else {
    if (typeof window !== "undefined") {
      await getAllKBs();
    }
  }
}

//删除知识库-弹框
const openDeleteModal = (knowledgeBaseId: number) => {
  ElMessageBox.confirm("确定要删除该知识库吗？此操作不可恢复", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await deleteKBsApi(knowledgeBaseId);
      ElMessage.success("删除成功");
      // 从recentKBsList中移除已删除的知识库
      // 最近访问删除
      const index1 = recentKBsList.value.findIndex(
        (kb: { id: number }) => kb.id === knowledgeBaseId
      );
      const index2 = knowledgeBaseList.value.findIndex(
        (kb: { id: number }) => kb.id === knowledgeBaseId
      );
      if (index1 !== -1) {
        recentKBsList.value.splice(index1, 1);
      }
      if (index2 !== -1) {
        knowledgeBaseList.value.splice(index2, 1);
      }
      if (knowledgeBaseList.value.length === 0) {
        //没有知识库了
        router.replace("/knowledgeBase/KnowledgeBaseMain");
      } else {
        console.log(route.path);
        console.log(route.path === "/knowledgeBase/KnowledgeBaseMain");

        if (route.path !== "/knowledgeBase/KnowledgeBaseMain") {
          const id = knowledgeBaseList.value[0].id;
          router.replace(`/knowledgeBase/${id}`);
        }
      }
    } catch (error: any) {
      ElMessage.error(error.message);
      console.error("删除知识库出错:", error);
    }
  });
};

const handleLogoClick = async () => {
  await knowledgeBaseStore.getRecentKBs(5);
  router.replace("/knowledgeBase/KnowledgeBaseMain");
};

const changToKB = (id: number) => {
  router.replace(`/knowledgeBase/${id}`);
};
</script>

<template>
  <div class="common-layout">
    <el-container style="height: 100%">
      <el-header class="header" height="65px">
        <div class="header-logo" @click="handleLogoClick">知识库系统</div>
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
        <el-aside width="200px" class="aside">
          <el-menu
            :default-active="activeMenu"
            :default-openeds="['1']"
            class="menu"
            @open="handleOpen"
            @close="handleClose"
            active-text-color="rgba(140, 122, 230)"
            router
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <Reading />
                </el-icon>
                <span>知识库</span>
              </template>
              <el-menu-item
                v-for="item in knowledgeBaseStore.knowledgeBaseList"
                :key="item.id"
                :index="`${item.id}`"
                style="display: flex; align-items: center"
                @click="changToKB(item.id)"
              >
                <div style="display: flex; align-items: center; flex: 1">
                  <el-icon><Folder /></el-icon>
                  <span
                    style="
                      margin-left: 8px;
                      max-width: 64px;
                      display: inline-block;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      vertical-align: middle;
                    "
                  >
                    {{
                      item.name.length > 4
                        ? item.name.slice(0, 4) + "..."
                        : item.name
                    }}
                  </span>
                </div>
                <div style="margin-left: auto" @click.stop>
                  <MoreActions
                    :id="item.id"
                    @edit="openEditDialog"
                    @delete="openDeleteModal"
                  />
                </div>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view
            @edit="openEditDialog"
            @delete="openDeleteModal"
          ></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- 统一的编辑弹窗 -->
    <el-dialog v-model="dialogFormVisible" title="编辑知识库" width="500px">
      <el-form v-model="form">
        <el-form-item label="知识库名称">
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="请输入知识库名称"
          />
        </el-form-item>
        <el-form-item label="知识库描述">
          <el-input
            v-model="form.desc"
            type="textarea"
            placeholder="请输入知识库描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

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
  .main {
    height: 100%;
  }
  :deep(.el-main) {
    padding: 0 !important;
  }
}
</style>
