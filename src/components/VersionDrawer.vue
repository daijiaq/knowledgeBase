<template>
  <el-drawer
    v-model="drawerVisible"
    size="100%"
    direction="rtl"
    :with-header="true"
    custom-class="full-drawer"
  >
    <template #header>
      <div class="drawer-header-flex">
        <span>历史记录</span>
        <div class="drawer-header-actions">
          <el-button size="large" type="primary" @click="restoreVersion">恢复此记录</el-button>
        </div>
      </div>
    </template>
  
    <div class="version-drawer-main">
      <!-- 左侧历史记录列表 -->
      <div class="version-list">
        <div class="version-list-header">

        全部记录
        </div>
        <el-scrollbar class="version-list-scroll">
          <div
            v-for="item in filteredList"
            :key="item.id"
            :class="['version-item', { active: item.id === selectedId }]"
            @click="selectVersion(item)"
            style="display: flex; align-items: center; justify-content: space-between;"
          >
            <div>
              <div class="version-time">{{ formatTime(item.savedAt) }}</div>
              <div class="version-desc">版本号：{{item.versionNumber}}</div>
            </div>
            <span @click.stop="deleteVersion(item)">
            删除
            </span>
          </div>
        </el-scrollbar>
      </div>
      <!-- 右侧内容区 -->
      <div class="version-content">
        <div class="version-content-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <el-tag type="info" effect="plain">
              版本 {{ selected?.versionNumber || '-' }}
            </el-tag>
            <span style="font-weight: bold; color: #7a72e0;">VS</span>
            <el-select v-model="compareId" size="small" style="width: 80px;">
              <el-option
                v-for="item in filteredList"
                :key="item.versionNumber"
                :label="'版本 ' + item.versionNumber"
                :value="item.versionNumber ?? ''"
              />
            </el-select>
            <el-button size="small" type="primary" @click="compare">对比</el-button>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="background:#ffecec; text-decoration:line-through; padding:2px 6px; border-radius:2px; color:#d32f2f;">删除</span>
            <span style="background:#d4fcbc; padding:2px 6px; border-radius:2px; color:#388e3c;">增加</span>
          </div>
        </div>
        <div class="version-content-body">
          <!-- 历史内容 -->
          <ReadonlyEditor v-if="selectedContent" :content="selectedContent" />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getHistoryVersion, getVersionContent } from '../api/version'
import { ElMessageBox, ElMessage } from 'element-plus'
import { deleteVersion as apiDeleteVersion,revertToVersion,compareVersions } from '../api/version' 
import ReadonlyEditor from './ReadonlyEditor.vue'
const props = defineProps({
  docId:Number // 文档ID作为prop传入
})
const emits = defineEmits([ 'restore'])
const drawerVisible = ref(false)


interface VersionItem {
  id: number | string
  savedAt: string
  versionNumber?: string
  status?: string
  time?: string
}
const versionList = ref<VersionItem[]>([])
const selectedId = ref<string | number | null>(null)
const selectedContent = ref('')
const compareId = ref('')

const selected = computed(() => {
  return versionList.value.find(item => item.versionNumber === selectedId.value) || null
})

// 暴露刷新方法给父组件
defineExpose({
  refreshHistory
})

// 获取历史版本
async function refreshHistory() {
  if (props.docId !== undefined) {
    const res = await getHistoryVersion(props.docId!)
    versionList.value = res.data || []
    if (versionList.value.length > 0) {
      selectVersion(versionList.value[0])
    }
  }
}

// 组件挂载获取版本列表
onMounted(async () => {
  refreshHistory()
})

const filteredList = computed(() => {
  let list = versionList.value
  return list
})

// 选择版本
async function selectVersion(item: VersionItem) {
  selectedId.value = item.versionNumber ?? ''
  if (props.docId !== undefined) {
    const res = await getVersionContent(props.docId, Number(item.versionNumber))
    selectedContent.value = res.data?.content || ''
  }
}
// 对比版本内容
function compare() {
  if (!selectedId.value || !compareId.value) {
    ElMessage.warning('请选择要对比的版本')
    return
  }
  const selectedVersion = selectedId.value
  const compareVersion = versionList.value.find(v => v.versionNumber === compareId.value)?.versionNumber
  if (!selectedVersion || !compareVersion) {
    ElMessage.error('无法找到对应的版本进行对比')
    return
  }

  compareVersions(props.docId!, Number(selectedVersion), Number(compareVersion))
    .then(res => {
      selectedContent.value = res.data?.tiptap || ''
      ElMessage.success('对比成功')
    })
    .catch(err => {
      ElMessage.error('对比失败: ' + err.message)
    })
}
// 回退版本
async function restoreVersion() {
  if (!selectedId.value) {
    ElMessage.warning('请选择要回退的版本')
    return
  }
  try {
    await ElMessageBox.confirm('确定要将当前文档回退到该历史版本吗？', '提示', { type: 'warning' })
    if (props.docId !== undefined) {
      await revertToVersion(props.docId, Number(selectedId.value))
      ElMessage.success('回退成功')
      emits('restore') // 通知父组件
      // 刷新历史列表
      const res = await getHistoryVersion(props.docId)
      versionList.value = res.data || []
      if (versionList.value.length > 0) {
        selectVersion(versionList.value[0])
      }
      drawerVisible.value = false
    }
  } catch (e) {
    console.error('回退失败:', e)
    ElMessage.error('回退失败，请稍后重试')
  }
}
// 删除版本
async function deleteVersion(item: VersionItem) {
  try {
    await ElMessageBox.confirm('确定要删除该历史版本吗？', '提示', { type: 'warning' })
    if (props.docId === undefined) {
      ElMessage.error('文档ID不存在，无法删除版本')
      return
    }
    await apiDeleteVersion(props.docId, Number(item.versionNumber)) 
    versionList.value = versionList.value.filter(v => v.id !== item.id)
    ElMessage.success('删除成功')
    // 如果删除的是当前选中项，自动选中第一个
    if (selectedId.value === item.id) {
      if (versionList.value.length > 0) {
        selectVersion(versionList.value[0])
      } else {
        selectedId.value = null
        selectedContent.value = ''
      }
    }
  } catch (e) {
    // 用户取消或接口报错
    console.error('删除失败:', e)
    ElMessage.error('删除失败，请稍后重试')
  }
}
 // 时间转换
function formatTime(timeStr: string) {
  const date = new Date(timeStr)
  return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`
}
</script>

<style scoped>
.version-drawer-main {
  display: flex;
  height: 100%;
}
.version-list {
  width: 260px;
  border-right: 1px solid #f0f0f0;
  background: #fafbfc;
  display: flex;
  flex-direction: column;
}
.version-list-header {
  font-size:15px;
  padding: 16px;
  border-bottom: 1px solid #eee;
}
.version-list-scroll {
  flex: 1;
  overflow-y: auto;
}
.version-item {
  padding: 12px 16px;
  cursor: pointer;
  border-left: 4px solid transparent;
  transition: background 0.2s;
}
.version-item.active {
  background: #f5f7fa;
  border-left: 4px solid #7a72e0;
}
.version-time { font-weight: bold; }
.version-author, .version-status { font-size: 12px; color: #999; }
.version-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
}
.version-content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.version-content-body {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  height: 700px;    
  overflow-y: auto;       /* 超出时滚动 */
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
}
.drawer-header-flex {
  margin-top:5px !important;
  font-size:25px !important;
  font-weight: bold !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  padding: 8px 24px;
}
.drawer-header-actions {
  display: flex;
  gap: 8px;
}
</style>