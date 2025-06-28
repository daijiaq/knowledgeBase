<template>
    <div>
      <!-- 文件夹 -->
      <div 
      class="doc-item"
      @click="selectFolder(item.id)"
      :class="{ active: currentDocId === item.id }"
      >
        <!-- 展开/收起箭头 -->
        <span class="arrow-icon" @click.stop="selectFolder(item.id)">
          <svg v-if="children.folders.length > 0 || children.documents.length > 0" :style="{transform: showDetail ? 'rotate(90deg)' : 'rotate(0deg)'}" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="16" height="16"></svg>
        </span>
        <div class="doc-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
              <svg
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
                <el-dropdown-item @click="showEditDialog=true">重命名</el-dropdown-item>
                <el-dropdown-item class="danger" @click="deleteFolder(item.id)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <!-- 子列表 -->
      <div class="children" v-if="showDetail" style="padding-left: 10px;">
        <FolderItem v-for="item in children.folders" :item="item" :getKBsContent="getKBsContent2" ref="folderItem" :key="item.id" :expandFolder="expandFolder"/>
      </div>
    </div>

    <!-- 重命名对话框 -->
    <el-dialog v-model="showEditDialog" title="重命名" width="400px">
      <el-form v-model="newDocName" label-width="80px">
        <el-input v-model="newDocName" placeholder="请输入文档名称" />
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="editFolder(item.id,newDocName)">确定</el-button>
      </template>
    </el-dialog>
</template>
    
<script lang='ts' setup name='FolderItem'>
import { ref,defineOptions, reactive,watch } from 'vue';
  import { useKnowledgeBaseStore } from '../stores/useKnowledgeBaseStore';
  import { storeToRefs } from 'pinia';
  import { deleteFolderApi,editFolderApi } from '../api/folder';
  import { ElMessage,ElMessageBox } from 'element-plus';
  const knowledgeBaseStore = useKnowledgeBaseStore()
  const {currentDocId} = storeToRefs(knowledgeBaseStore)
  const {selectDoc,getFolderContent,selectDocType} = knowledgeBaseStore
  const children = reactive({
    folders:[],
    documents:[]
  })
  const {item,getKBsContent,expandFolder} = defineProps(['item','getKBsContent','expandFolder'])
  
    //获取文件夹里面的内容
  const showDetail = ref(true)
  getFolderChildren(item.id)
  
  async function selectFolder(folderId:number){
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
        selectDoc(null)
        selectDocType('folder')
      } catch (error: any) {
        ElMessage.error(error.message)
        console.error("删除文件夹失败:", error) 
      }
    }) 
  }

  const showEditDialog = ref(false)
  const newDocName = ref(item.name)

  async function editFolder(folderId:number,name:string){
    try{
      await editFolderApi(folderId,name)
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
    }
  })
</script>
    
<style scoped>
    .doc-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 2px;

        /* 箭头图标样式 */
        .arrow-icon {
          display: flex;
          align-items: center;
          margin-right: 4px;
          width: 16px;
          height: 16px;
          user-select: none;
        }

        &:hover {
          background: var(--background-color);
        }

        &.active {
          background: var(--primary-color);
          color: white;

          .doc-icon svg {
            color: white;
          }
        }

        .doc-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;

          svg {
            width: 100%;
            height: 100%;
            color: var(--text-color-secondary);
          }
        }

        .doc-title {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
        }

        .doc-actions {
          opacity: 0;
          transition: opacity 0.2s ease;

          .el-button {
            width: 20px;
            height: 20px;
            padding: 0;

            svg {
              width: 12px;
              height: 12px;
            }
          }
        }

        &:hover .doc-actions {
          opacity: 1;
        }
      }
</style>