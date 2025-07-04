<template>
  <div class="editor-page">
    <CollaborativeEditor
      :key="String($route.params.documentId)"
      :docId="Number($route.params.documentId)"
      :roomId="String($route.params.documentId)"
      :userName="userName"
    />
    <Comment :key="String($route.params.documentId)" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const userName = ref("");
userName.value = sessionStorage.getItem("username") || "";
</script>
<style lang="css" scoped>
.editor-page {
  display: flex;
  height: 100%;
}
</style>
