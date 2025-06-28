<script setup lang="ts">
import { Document, Timer } from '@element-plus/icons-vue';
import MoreActions from '../components/MoreActions.vue';
import dayjs from 'dayjs';

const props = defineProps<{
  id: number; // 新增id字段
  title: string;
  description: string;
  docCount?: number;
  updateTime: string;
}>();

const emits = defineEmits(['edit', 'delete'])

// 处理卡片点击事件
const handleCardClick = () => {
  console.log(`Card with ID ${props.id} clicked`);
};
</script>

<template>
  <div class="dataBaseCard" @click="handleCardClick">
    <div class="cardLine"></div>
    <div class="cardIcon">
      <el-icon color="#6366f1" size="25px">
        <Document />
      </el-icon>
    </div>
    <div class="moreContainer">
      <MoreActions
        :id="id"
        @edit="emits('edit')"
        @delete="emits('delete')"
      />
    </div>
    <div class="cardName">{{ title }}</div>
    <div class="cardDes">{{ description }}</div>
    <div class="cardOther">
      <div class="rightTime">
        <el-icon color="#9ca3af" size="16px">
          <Timer />
        </el-icon>
        <p class="time">{{ dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dataBaseCard {
  position: relative;
  flex: 0 0 calc(33.333% - 14px);
  height: 250px;
  text-align: left;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    .cardLine {
      opacity: 1;
    }
  }
  
  .cardLine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .cardIcon {
    margin: 21px 24px 0;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
    border-radius: 12px;
    display: flex;    
    align-items: center;
    justify-content: center;
  }
  
  .moreContainer {
    position: absolute;
    top: 16px;
    right: 16px;
    /* 注意：这里移除了原组件中moreContainer的定位和样式，因为已经在MoreActions组件中定义 */
    /* 只保留必要的样式 */
  }
  
  .cardName {
    padding: 0 24px 0;
    margin: 13px 0 0;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.3;
  }
  
  .cardDes {
    padding: 0 24px 16px;
    color: #6b7280;
    font-size: 14px;
    margin-top: 12px;
    height: 42px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2; 
    overflow: hidden;
  }
  
  .cardOther {
    padding: 16px 24px 24px;
    margin-top: 32px;
    border-top: 1px solid rgb(107, 114, 128, 0.2);
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center; 
    
    .leftText, .rightTime {
      display: flex;
      align-items: center;
      gap: 8px; /* 图标与文字的间距 */
      
      .docNum, .time {
        color: #9ca3af;
        font-size: 13px;
      }
    } 
  }
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}
</style>