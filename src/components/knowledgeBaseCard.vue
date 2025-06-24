<script setup lang="ts">
import { Document, Timer, MoreFilled } from '@element-plus/icons-vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  title: string
  description: string
  docCount: number
  updateTime: string
}>()

const emits = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()


</script>

<template>
  <div class="dataBaseCard">
    <div class="cardLine"></div>
    <div class="cardIcon">
      <el-icon color="#6366f1" size="25px"><Document /></el-icon>
    </div>
    <div class="moreContainer">
      <el-dropdown placement="bottom">
        <el-icon class="getMore" color="#9ca3af"><MoreFilled /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="$emit('edit')">编辑</el-dropdown-item>
            <el-dropdown-item @click="$emit('delete')">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="cardName">{{ title }}</div>
    <div class="cardDes">{{ description }}</div>
    <div class="cardOther">
      <div class="leftText">
        <el-icon color="#9ca3af" size="16px"><Document /></el-icon>
        <p class="docNum">{{ docCount }} 篇文档</p>
      </div>
      <div class="rightTime">
        <el-icon color="#9ca3af" size="16px"><Timer /></el-icon>
        <p class="time">{{ updateTime }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
    .dataBaseCard{
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
                .cardLine{
                    opacity: 1;
                }
            }
            .cardLine{
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(
                  90deg,
                  var(--primary-color),
                  var(--primary-light)
                );
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .cardIcon{
                margin: 21px 24px 0;
               width: 48px;
                height: 48px;
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
                border-radius: 12px;
                display: flex;    
                align-items: center;
                justify-content: center;
            }
            .moreContainer{
                width: 32px;
                height: 32px;
                border-radius: 8px;
                 position: absolute;
                top: 35px;
                right: 28px;
                display: flex;
               align-items: center;
               justify-content: center;
                &:hover{
                    background: rgb(230, 230, 250, 0.3);
                }
                .getMore{
                  border:none
                }
            }
          
            .cardName{
                padding: 0 24px 0;;
                margin: 13px 0 0;
                font-size: 20px;
                font-weight: 700;
                line-height: 1.3;
            }
            .cardDes{
                padding: 0 24px 16px;;
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
            .cardOther{
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
                    .docNum{
                       color: #9ca3af;
                       font-size: 13px;
                   }
                   .time{
                       color: #9ca3af;
                       font-size: 13px;
                   }
                } 
             
            }
        }
</style>

