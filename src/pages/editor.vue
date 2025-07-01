<template>
    <CollaborativeEditor :key="String($route.params.documentId)" :docId="Number($route.params.documentId)" :roomId="String($route.params.documentId)" />
    <Comment />
</template>

<script lang="ts" setup>

</script>
<style lang="">
    
</style>