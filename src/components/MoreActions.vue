<script setup lang="ts">
import { MoreFilled } from '@element-plus/icons-vue'
const props = defineProps<{ id: number }>()
const emit = defineEmits(['edit', 'delete'])

const handleEdit = () => {
  emit('edit', props.id)
}
const handleDelete = () => {
  emit('delete', props.id)
}
</script>

<template>
  <el-dropdown bottom>
    <div class="more-container" @click.stop>
      <el-icon class="get-more" color="#9ca3af">
        <MoreFilled />
      </el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleEdit">编辑</el-dropdown-item>
        <el-dropdown-item @click="handleDelete">删除</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss">
.more-container {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  position: absolute;
  top: 10px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgb(230, 230, 250, 0.3);
  }
}
.get-more {
  border: none;
}
</style>