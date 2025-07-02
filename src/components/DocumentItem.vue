<template>
  <div
    class="doc-item"
    @click="selectCurrentDoc(item.id)"
    :class="{
      active: currentDocumentId === item.id && currentDocType === 'document',
    }"
  >
    <div class="doc-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828a2 2 0 0 0-.586-1.414l-4.828-4.828A2 2 0 0 0 14.172 2H6zm7 1.414L19.586 10H17a1 1 0 0 1-1-1V3.414z"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
        />
      </svg>
    </div>
    <span class="doc-title">{{ item.title }}</span>
    <div class="doc-actions" @click.stop>
      <el-dropdown trigger="click" @click.stop>
        <el-button size="small">
          <svg
            width="12"
            height="12"
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
            <el-dropdown-item @click="showEditDialog = true"
              >重命名</el-dropdown-item
            >
            <el-dropdown-item class="danger" @click="deleteDoc(item.id)"
              >删除</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <!-- 重命名对话框 -->
  <EditNameDialog v-model="showEditDialog" :editName="editDocName" />
</template>

<script lang="ts" setup name="DocumentItem">
import { ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useKnowledgeBaseStore } from "../stores/useKnowledgeBaseStore";
import EditNameDialog from "./EditNameDialog.vue";
import * as documentApi from "../api/document";
import { clearDocumentIdsCache } from "../utils/route-guard";
const router = useRouter();
const knowledgeBaseStore = useKnowledgeBaseStore();
const { currentDocumentId, currentDocType } = storeToRefs(knowledgeBaseStore);
const { selectDoc, selectDocType } = knowledgeBaseStore;
import type { Ref } from "vue";
const knowledgeBaseId = inject<Ref<string | number> | undefined>(
  "knowledgeBaseId"
);
const props = defineProps(["item", "getKBsContent", "onSelectDoc"]);
const selectCurrentDoc = (id: number) => {
  if (props.onSelectDoc) {
    props.onSelectDoc(id);
    // const data = await getKBsAllDocumentIdsApi(39);
    // console.log(data);
  } else {
    knowledgeBaseStore.selectDocType("document");
    knowledgeBaseStore.selectDoc(id);
    if (knowledgeBaseId) {
      router.replace(`/knowledgeBase/${knowledgeBaseId.value}/${id}`);
    }
  }
};
const showEditDialog = ref(false);
const editDocName = async (name: string) => {
  await documentApi.editDocumentName(props.item.id, name);
  showEditDialog.value = false;
  props.getKBsContent();
};
//删除文件夹
async function deleteDoc(documentId: number) {
  ElMessageBox.confirm("确定要删除该文档吗？此操作不可恢复", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await documentApi.deleteDocument(documentId);
      ElMessage.success("删除文档成功");
      // 清除缓存，确保权限验证使用最新数据
      if (knowledgeBaseId) {
        clearDocumentIdsCache(Number(knowledgeBaseId.value));
      }
      props.getKBsContent();
      selectDocType("folder");
      selectDoc(null);
    } catch (error: any) {
      ElMessage.error(error.message);
      console.error("删除文档失败:", error);
    }
  });
}

defineExpose({
  getKBsContent: () => {
    props.getKBsContent();
  },
});
</script>

<style scoped>
@import "../css/doc-item.scss";
</style>
