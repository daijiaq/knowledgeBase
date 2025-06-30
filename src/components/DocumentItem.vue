<template>
    <div 
      class="doc-item"
      @click="selectCurrentDoc(item.id)"
      :class="{ active: currentDocId === item.id&&currentDocType === 'document' }"
      >
        <div class="doc-icon">
          <svg
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
</template>
    
<script lang='ts' setup name='DocumentItem'>
import { storeToRefs } from 'pinia';
import { useKnowledgeBaseStore } from '../stores/useKnowledgeBaseStore';
const knowledgeBaseStore = useKnowledgeBaseStore()
const {currentDocId,currentDocType} = storeToRefs(knowledgeBaseStore)
const selectCurrentDoc = (id: number) => {
  knowledgeBaseStore.selectDoc(id)
  knowledgeBaseStore.selectDocType('document')
}
const {item} = defineProps(['item'])

    
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