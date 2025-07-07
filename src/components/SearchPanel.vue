<template>
  <div v-if="visible" class="search-panel">
        <div class="search">
          <input
          ref="searchInput"
          v-model="searchQuery"
          placeholder="搜索内容..."
          class="search-input"
          @keydown.enter="handleSearch"
          @keydown.esc="closePanel"
        />
        <button 
          @click="handleSearch" 
          class="nav-btn"
        >
          <el-icon><Search /></el-icon>
        </button>
         <button 
          @click="prevMatch"
          class="nav-btn"
        >
          <el-icon><ArrowUp /></el-icon>
        </button>
        <button 
          @click="nextMatch" 
          class="nav-btn"
        >
          <el-icon><ArrowDown /></el-icon>
        </button>
        <button 
          @click="closePanel" 
          class="nav-btn"
        >
          <el-icon><CloseBold /></el-icon>
        </button>
    </div>
    <div class="search-options">
          <label class="option-item">
            <input 
              type="checkbox" 
              v-model="searchOptions.caseSensitive"
              @change="handleSearch"
            />
            <span>区分大小写</span>
          </label>
          <label class="option-item">
            <input 
              type="checkbox" 
              v-model="searchOptions.wholeWord"
              @change="handleSearch"
            />
            <span>全词匹配</span>
          </label>
          <label class="option-item">
            <input 
              type="checkbox" 
              v-model="searchOptions.regex"
              @change="handleSearch"
            />
            <span>正则表达式</span>
          </label>
        </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ArrowUp , ArrowDown ,Search , CloseBold } from '@element-plus/icons-vue'

interface SearchOptions {
  caseSensitive: boolean
  wholeWord: boolean
  regex: boolean
}

interface Props {
  visible: boolean
  editor: any
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')


const searchOptions = ref<SearchOptions>({
  caseSensitive: false,
  wholeWord: false,
  regex: false,
})



const handleSearch = () => {
  if (!props.editor) {
    console.warn('Editor not available for search')
    return
  }
  
  try {
    if (!searchQuery.value.trim()) {
      props.editor.commands.clearSearch()
      return
    }

    props.editor.commands.search(searchQuery.value, searchOptions.value)
  } catch (error) {
    console.error('Search error:', error)
  }
}

const nextMatch = () => {
  if (props.editor) {
    try {
      props.editor.commands.nextMatch()
    } catch (error) {
      console.error('Next match error:', error)
    }
  }
}

const prevMatch = () => {
  if (props.editor) {
    try {
      props.editor.commands.prevMatch()
    } catch (error) {
      console.error('Previous match error:', error)
    }
  }
}



const closePanel = () => {
  if (props.editor) {
    props.editor.commands.clearSearch()
  }
  searchQuery.value = ''
  emit('close')
}

// 键盘快捷键处理
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.visible) return

  // 阻止默认行为
  if (event.key === 'Enter' || event.key === 'Escape') {
    event.preventDefault()
  }
  else if (event.key === 'Escape') {
    closePanel()
  }
}


onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.search-panel {
  position: absolute;
  top: 110%;
  right: 50%;
  transform: translateX(50%);
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 10px;
}

.search {
  display: flex;
}


.search-input {
  width: 60%;
  height: 25px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.search-options {
  display: flex;
  margin-top: 10px;
  padding-left: 5px;
  flex-wrap: wrap;
}

.option-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.option-item input[type="checkbox"] {
  margin: 0;
}


.navigation-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  padding: 6px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  margin-left: 3px;
}

.nav-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #ccc;
}


/* 响应式设计 */
@media (max-width: 480px) {
  .search-panel {
    width: calc(100vw - 20px);
    right: 10px;
  }
  
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style> 