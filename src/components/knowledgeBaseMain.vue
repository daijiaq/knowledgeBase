<script setup lang="ts">
import { Document } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useKnowledgeBaseStore } from "../stores/useKnowledgeBaseStore";
import { editKBsApi, deleteKBsApi, getKBsRecentApi } from "../api/knowledgeBase";

const knowledgeBaseStore = useKnowledgeBaseStore();
const router = useRouter();
const dialogFormVisible = ref(false);
const isEditMode = ref(false);
const formLabelWidth = "140px";

// 表单数据，新增id字段用于编辑
const form = reactive({
  id: 0,
  name: "",
  desc: "",
});

// 表单验证规则
const rules = reactive({
  name: [
    { required: true, message: "知识库名称不能为空", trigger: "blur" },
    { max: 20, message: "知识库名称不能大于20个字", trigger: "blur" },
  ],
  desc: [
    { required: true, message: "知识库描述不能为空", trigger: "blur" },
    { max: 50, message: "知识库描述不能大于50个字", trigger: "blur" },
  ],
});

// 定义知识库卡片项的类型
interface KnowledgeBaseCard {
  id: number 
  description: string 
  permission: string 
  name: string 
  lastAccessedAt: string 
}

// 定义响应式数组
const cardList = ref<KnowledgeBaseCard[]>([]) 

// 打开编辑弹框并填充数据
const openEditDialog = (knowledgeBaseId: number) => {
  isEditMode.value = true 
  dialogFormVisible.value = true 
  
  // 在cardList中查找对应的知识库
  const knowledgeBase = cardList.value.find(kb => kb.id === knowledgeBaseId) 
  
  if (knowledgeBase) {
    form.id = knowledgeBase.id 
    form.name = knowledgeBase.name 
    form.desc = knowledgeBase.description 
  } else {
    ElMessage.error("未找到该知识库") 
    dialogFormVisible.value = false 
  }
} 

// 打开新建弹框
const openCreateDialog = () => {
  isEditMode.value = false 
  resetForm() 
  dialogFormVisible.value = true 
} 

// 重置表单
const resetForm = () => {
  form.id = 0;
  form.name = "";
  form.desc = "";
};

// 提交表单
const submitForm = async () => {
  // 表单验证
  if (!form.name || !form.desc) {
    ElMessage.error("请填写完整信息");
    return;
  }
  
  try {
    let res: any;
    
    if (isEditMode.value) {
      // 执行编辑逻辑
      res = await editKBsApi(form.id, form.name, form.desc);
      ElMessage.success("编辑成功");
      
      // 更新cardList中的数据
      const index = cardList.value.findIndex(kb => kb.id === form.id);
      if (index !== -1) {
        cardList.value[index] = {
          ...cardList.value[index],
          name: form.name,
          description: form.desc,
          lastAccessedAt: new Date().toISOString().split('T')[0]
        };
      }
    } else {
      // 执行新建逻辑
      res = await knowledgeBaseStore.createKBs(form.name, form.desc);
      console.log(res.code);
      
      if (res.code === 200) {
        ElMessage.success(res.message);
        
        // 重新获取最近访问列表
        const recentRes = await getKBsRecentApi(5);
        cardList.value = recentRes.data;
      } else {
        ElMessage.error(res.message || "创建失败");
      }
    }
  } catch (error: any) {
    ElMessage.error(error.message );
    console.error("操作知识库出错:", error);
  } finally {
    dialogFormVisible.value = false;
  }
};

// 删除知识库-弹框
const openDeleteModal = (knowledgeBaseId: number) => {
  ElMessageBox.confirm("确定要删除该知识库吗？此操作不可恢复", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
        await deleteKBsApi(knowledgeBaseId) 
        ElMessage.success("删除成功")
        // 从cardList中移除已删除的知识库
        cardList.value = cardList.value.filter(kb => kb.id !== knowledgeBaseId) 
    } catch (error: any) {
      ElMessage.error(error.message)
      console.error("删除知识库出错:", error) 
    }
  }) 
} 

// 页面加载时获取最近访问的知识库
onMounted(async () => {
  try {
    const res = await getKBsRecentApi(5) 
    cardList.value = res.data 
    console.log(cardList.value)
  } catch (error) {
    ElMessage.error("获取知识库列表失败") 
    console.error("获取最近访问知识库出错:", error) 
  }
}) 
</script>

<template>
  <div class="whole-page">
    <div class="cardHeader">
      <div class="des">
        <div class="docIcon">
          <el-icon color="white" size="34px">
            <Document />
          </el-icon>
        </div>
        <div class="textDes">
          <div>我的知识库</div>
          <div>管理你的知识资产，让思维更有序</div>
        </div>
      </div>
      <div class="addNewButton" @click="openCreateDialog">
        <div>+ 新建知识库</div>
      </div>
    </div>
    <div class="dataBaseContainer">
      <knowledgeBaseCard
        v-for="item in cardList"
        :key="item.id"
        :title="item.name"
        :description="item.description"
        :update-time="item.lastAccessedAt"
        @edit="() => openEditDialog(item.id)" 
        @delete="() => openDeleteModal(item.id)" 
        @click="router.push(`/knowledgeBase/${item.id}`)"
      />

      <div class="addNewCard">
        <div class="detailContainer" @click="openCreateDialog">
          <div class="add">+</div>
          <div class="addDes">创建知识库</div>
          <div class="addDesDetail">创建一个新的知识库来组织您的内容</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 新建/编辑知识库弹出层 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="isEditMode ? '编辑知识库' : '新建知识库'"
    width="500px"
  >
    <el-form
      :model="form"
      :rules="rules"
      @keyup.enter.prevent
    >
      <el-form-item
        label="知识库名称"
        :label-width="formLabelWidth"
        prop="name"
      >
        <el-input
          v-model="form.name"
          autocomplete="off"
          placeholder="请输入知识库名称"
        />
      </el-form-item>
      <el-form-item
        label="知识库描述"
        :label-width="formLabelWidth"
        prop="desc"
      >
        <el-input
          v-model="form.desc"
          style="width: 380px"
          :autosize="{ minRows: 5, maxRows: 8 }"
          type="textarea"
          placeholder="请输入知识库描述"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
/* 样式部分与之前相同，未做修改 */
.whole-page {
  background: linear-gradient(rgba(230, 230, 250, 0.1)),
    linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  width: 100%;
  height: 100%;
  padding: 32px;
  overflow: scroll;
  scrollbar-width: none;
  .cardHeader {
    background-color: #fff;
    margin: 0 auto;
    padding: 0 30px;
    width: 98%;
    height: 146px;
    border-radius: 25px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .des {
      display: flex;
      align-items: center;
      gap: 19px;
      .docIcon {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 64px;
        width: 64px;
        background: linear-gradient(
          135deg,
          var(--primary-color),
          var(--primary-light)
        );
        border-radius: 20px;
        box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
      }
    }
    .textDes {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      & > div:first-child {
        font-size: 32px;
        font-weight: 800;
        background: linear-gradient(
          135deg,
          var(--primary-color),
          var(--primary-light)
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      & > div:last-child {
        color: #6b7280;
        font-weight: 500;
      }
    }
    .addNewButton {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 56px;
      padding: 0 32px;
      border-radius: 16px;
      font-weight: 700;
      font-size: 16px;
      background: linear-gradient(
        135deg,
        var(--primary-color),
        var(--primary-light)
      );
      border: none;
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
      transition: all 0.3s ease;
      color: #fff;
      font-size: 17px;
      cursor: pointer;
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 35px rgba(99, 102, 241, 0.4);
      }
    }
  }
  .dataBaseContainer {
    margin: 30px auto 0;
    width: 98%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;

    .addNewCard {
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(
        135deg,
        rgba(99, 102, 241, 0.02),
        rgba(139, 92, 246, 0.02)
      );
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      flex: 0 0 calc(33.333% - 14px);
      border-radius: 20px;
      transition: all 0.3s ease;
      cursor: pointer;
      height: 250px;
      border: 2px dashed transparent;
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        border: 2px dashed var(--primary-color);
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.05),
          rgba(139, 92, 246, 0.05)
        );
      }
      .detailContainer {
        text-align: center;
        .add {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--primary-light)
          );
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 39px;
        }
        .addDes {
          font-weight: bold;
          font-size: 20px;
        }
        .addDesDetail {
          color: #6b7280;
          font-size: 14px;
          margin-top: 12px;
        }
      }
    }
  }
}
::v-deep .el-form-item {
  margin-left: -52px !important;
}
::v-deep .el-button + .el-button {
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--primary-light)
  );
  color: #fff;
}
::v-deep .el-icon {
  font-size: 18px !important;
}
::v-deep .el-button + .el-button {
  border: none;
}
</style>