<template>
    <div>
      <!-- 文件夹 -->
      <div 
      class="doc-item"
      @click="selectFolder(item.id)"
      :class="{ active: currentDocId === item.id }"
      >
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
            <el-button type="text" size="small">
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
                <el-dropdown-item>重命名</el-dropdown-item>
                <el-dropdown-item class="danger">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <!-- 子列表 -->
      <div class="children" v-if="showDetail" style="padding-left: 10px;">
        <FolderItem v-for="item in children.folders" :item="item"/>
      </div>
    </div>
</template>
    
<script lang='ts' setup name='FolderItem'>
import { ref,defineOptions, reactive } from 'vue';
  import { useKnowledgeBaseStore } from '../stores/useKnowledgeBaseStore';
  import { storeToRefs } from 'pinia';
  const knowledgeBaseStore = useKnowledgeBaseStore()
  const {currentDocId} = storeToRefs(knowledgeBaseStore)
  const {selectDoc,getFolderContent} = knowledgeBaseStore
  const children = reactive({
    folders:[],
    documents:[]
  })
  const {item} = defineProps(['item'])
  
    //获取文件夹里面的内容
  const showDetail = ref(false)
  
  async function selectFolder(folderId:number){
    selectDoc(folderId)
    if(showDetail.value==false){
    //展示
    const data = await getFolderContent(folderId)
    const {folders,documents}= data
    children.folders = folders
    children.documents = documents
    }
    showDetail.value = !showDetail.value
  } 
  //如果刷新的时候，当前选中的文件夹没有打开则打开
  if(currentDocId.value===item.id&&showDetail.value===false){selectFolder(item.id)}

  defineOptions({
    name:'FolderItem'
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