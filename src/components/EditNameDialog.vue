<template>
  <el-dialog :model-value="props.modelValue" title="重命名" width="400px">
    <el-form v-model="newDocName" label-width="80px">
      <el-input v-model="newDocName" placeholder="请输入文档名称" />
    </el-form>
    <template #footer>
      <el-button @click="emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" @click="editName(newDocName)">确定</el-button>
    </template>
  </el-dialog>
</template>
    
<script lang='ts' setup name=''>
import { ref, defineProps,watch} from 'vue';
const props = defineProps(['modelValue','editName'])
const emit = defineEmits(['update:modelValue'])
const newDocName = ref('')
watch(() => props.modelValue, (newVal) => {
  if(newVal){newDocName.value = ''}
})

</script>
    
<style scoped>
    
</style>