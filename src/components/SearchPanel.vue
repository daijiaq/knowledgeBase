<template>
  <div v-if="visible" class="search-panel">
    <div class="search-header">
      <div class="search-input-group">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="搜索内容..."
          class="search-input"
          @keydown.enter="handleSearch"
          @keydown.esc="closePanel"
          @input="handleInput"
        />
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
    </div>

    <div class="search-controls">
      <div class="navigation-controls">
        <button 
          @click="prevMatch" 
          class="nav-btn"
        >
          上一个
        </button>
        <button 
          @click="nextMatch" 
          class="nav-btn"
        >
          下一个
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { debounce } from '../utils/debounce'

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
const isSearching = ref(false)

// 添加本地状态来跟踪搜索结果
const localMatchCount = ref(0)
const localCurrentIndex = ref(-1)
const localHasMatches = ref(false)

const searchOptions = ref<SearchOptions>({
  caseSensitive: false,
  wholeWord: false,
  regex: false,
})


// 防抖搜索
const debouncedSearch = debounce((query: string) => {
  if (!props.editor) {
    console.warn('Editor not available for search')
    return
  }
  
  isSearching.value = true
}, 300)

// 方法
const handleInput = () => {
  debouncedSearch(searchQuery.value)
}

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


const debugSearch = () => {
  console.log('Current search state:', {
    matchCount: localMatchCount.value,
    currentIndex: localCurrentIndex.value,
    hasMatches: localHasMatches.value,
    query: searchQuery.value,
    options: searchOptions.value
  })
  

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

// 定期检查搜索状态（备用方案）
let stateCheckInterval: number | null = null

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  
  // 清理定时器
  if (stateCheckInterval) {
    clearInterval(stateCheckInterval)
  }
})
</script>

<style scoped>
.search-panel {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 400px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.search-header {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.search-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-input {
  width: 100%;
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
  gap: 16px;
  flex-wrap: wrap;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.option-item input[type="checkbox"] {
  margin: 0;
}

.search-controls {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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
  align-items: center;
  justify-content: center;
}

.nav-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #ccc;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.match-info {
  font-size: 12px;
  color: #666;
  min-width: 40px;
  text-align: center;
}

.replace-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.replace-input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
}

.replace-input:focus {
  border-color: #1890ff;
}

.replace-btn,
.replace-all-btn {
  padding: 6px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.replace-btn:hover:not(:disabled),
.replace-all-btn:hover:not(:disabled) {
  background: #f5f5f5;
}

.replace-btn:disabled,
.replace-all-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toggle-replace-btn {
  padding: 6px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-replace-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.toggle-replace-btn:hover {
  background: #f5f5f5;
}

.toggle-replace-btn.active:hover {
  background: #40a9ff;
}

.debug-btn {
  padding: 6px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.debug-btn:hover {
  background: #f5f5f5;
}

.close-btn {
  padding: 6px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f5f5f5;
}

.search-results {
  padding: 8px 12px;
  border-top: 1px solid #eee;
  background: #fafafa;
}

.results-info {
  font-size: 12px;
  color: #666;
}

.results-info.no-results {
  color: #ff4d4f;
}

.results-info.searching {
  color: #1890ff;
}

/* 图标样式 */
.iconfont {
  font-size: 14px;
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
  
  .replace-controls {
    order: 2;
  }
  
  .action-controls {
    order: 3;
    justify-content: center;
  }
}
</style> 