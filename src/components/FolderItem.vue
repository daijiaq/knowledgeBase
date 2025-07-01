<template>
    <div>
      <!-- 文件夹 -->
      <div 
      class="doc-item"
      @click="selectFolder(item.id)"
      :class="{ active: currentDocId === item.id &&currentDocType === 'folder' }"
      >
        <!-- 展开/收起箭头 -->
        <span class="arrow-icon" @click.stop="selectFolder(item.id)">
          <svg width="16" height="16" :style="{transform: showDetail ? 'rotate(90deg)' : 'rotate(0deg)'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <div class="doc-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
        </div>
        <span class="doc-title">{{ item.name }}</span>
        <div class="doc-actions" @click.stop>
          <el-dropdown trigger="click" @click.stop>
            <el-button size="small">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="5" r="1" fill="currentColor" />
                <circle cx="12" cy="19" r="1" fill="currentColor" />
              </svg>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="showEditDialog=true;">重命名</el-dropdown-item>
                <el-dropdown-item class="danger" @click="deleteFolder(item.id)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <!-- 子列表 -->
      <div class="children" v-if="showDetail" style="padding-left: 10px;">
        <FolderItem v-for="item in children.folders" :item="item" :getKBsContent="getKBsContent2" ref="folderItem" :key="item.id" :expandFolder="expandFolder"/>
        <DocumentItem v-for="item in children.documents" :item="item" :getKBsContent="getKBsContent2" :key="item.id" ref="docItem"/>
      </div>
    </div>

    <!-- 重命名对话框 -->
    <EditNameDialog v-model="showEditDialog" :editName="editFolder"/>
</template>
    
<script lang='ts' setup name='FolderItem'>
import { ref,defineOptions, reactive,watch } from 'vue';
  import { useKnowledgeBaseStore } from '../stores/useKnowledgeBaseStore';
  import { storeToRefs } from 'pinia';
  import { deleteFolderApi,editFolderApi } from '../api/folder';
  import { ElMessage,ElMessageBox } from 'element-plus';
  import EditNameDialog from './EditNameDialog.vue';
  const knowledgeBaseStore = useKnowledgeBaseStore()
  const {currentDocId,currentDocType} = storeToRefs(knowledgeBaseStore)
  const {selectDoc,getFolderContent,selectDocType} = knowledgeBaseStore
  import DocumentItem from './DocumentItem.vue';
  const children = reactive({
    folders:[],
    documents:[]
  })
  const {item,getKBsContent,expandFolder} = defineProps(['item','getKBsContent','expandFolder'])
  
    //获取文件夹里面的内容
  const showDetail = ref(true)
  getFolderChildren(item.id)
  
  async function selectFolder(folderId:number){
    selectDocType('folder')
    selectDoc(folderId)
    if(showDetail.value==false){
    //展示
      await getFolderChildren(folderId)
    }
    showDetail.value = !showDetail.value
  } 
  async function getFolderChildren(folderId:number){
    try{
      const data = await getFolderContent(folderId)
      const {folders,documents}= data
      children.folders = folders
      children.documents = documents
    }catch(error){
      console.error('获取文件夹内容失败:', error)
      ElMessage.error('获取文件夹内容失败，请稍后再试')
      return
    }
  }
  //如果刚创建则把这个文件夹打开
  watch(()=>expandFolder,(newValue)=>{
    if(newValue===item.id&&showDetail.value===false){
      showDetail.value = true
      getFolderChildren(item.id) //获取当前文件夹内容
    }
  })
  

  //删除文件夹
  async function deleteFolder(folderId:number){
    ElMessageBox.confirm("确定要删除该文件夹吗？此操作不可恢复", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
      try {
        await deleteFolderApi(folderId)
        ElMessage.success("删除文件夹成功")
        getKBsContent()
        selectDocType('folder')
        selectDoc(null)
      } catch (error: any) {
        ElMessage.error(error.message)
        console.error("删除文件夹失败:", error) 
      }
    }) 
  }

  const showEditDialog = ref(false)

  async function editFolder(name:string){
    try{
      await editFolderApi(item.id,name)
      showEditDialog.value = false
      ElMessage.success('编辑文件夹成功')
      getKBsContent()
    }catch(error){
      console.error('编辑文件夹失败:', error)
      ElMessage.error('编辑文件夹失败，请稍后再试')
      return
    }
  }
  async function getKBsContent2() {
    try{
      await getKBsContent()
      await getFolderChildren(item.id)
    }catch(error){
      console.error('获取文件夹内容失败:', error)
      ElMessage.error('获取文件夹内容失败，请稍后再试')
      return
    }
  }

  defineOptions({
    name:'FolderItem'
  })
  const folderItem = ref(null)
  const docItem = ref(null)
  defineExpose({
    getKBsContent:()=>{
      getKBsContent()
      // folderItem.value?.getKBsContent() //刷新文件夹内容
      if(folderItem.value){
      for(let i=0;i<folderItem.value.length;i++){
        folderItem.value[i].getKBsContent()
      }
      showDetail.value = true //刷新后展开文件夹
      getFolderChildren(item.id) //刷新当前文件夹内容
      }
      if(docItem.value){
        for(let i=0;i<docItem.value.length;i++){
          docItem.value[i].getKBsContent()
        }
      }
    }
  })
</script>
    
<style scoped>
    @import '../css/doc-item.scss'
</style>