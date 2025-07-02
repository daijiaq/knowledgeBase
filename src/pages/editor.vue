<template>
  <div class="editor-page">
    <CollaborativeEditor
    :key="String($route.params.documentId)"
    :docId="Number($route.params.documentId)"
    :roomId="String($route.params.documentId)"
  />
    <Comment :key="String($route.params.documentId)" />
  </div>
</template>

<script lang="ts" setup>
</script>
<style lang="css" scoped>
.editor-page {
  display: flex;
  height: 100%;
}
</style>
