<script setup lang="ts">
import {
  Document,
  Timer,
  MoreFilled
} from "@element-plus/icons-vue";


import { reactive, ref } from 'vue'
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const form = reactive({
  name: '',
  desc: '',
})
const rules = reactive({
  name: [
    { required: true, message: '知识库名称不能为空', trigger: 'blur' },
    { max: 20, message: '知识库名称不能大于20个字', trigger: 'blur' },
  ],
  desc:[
    { required: true, message: '知识库描述不能为空', trigger: 'blur' },
    { max: 50, message: '知识库描述不能大于50个字', trigger: 'blur' },
  ]
}

)

</script>

<template>
  <div class="whole-page">
      <div class="cardHeader">
        <div class="des">
            <div class="docIcon">
                <el-icon color="white" size="34px"><Document /></el-icon>
            </div>
            <div class="textDes">
                <div>我的知识库</div>
               <div>管理你的知识资产，让思维更有序</div>
            </div>
        </div>
        <div class="addNewButton" @click="dialogFormVisible = true">
            <div>+ 新建知识库</div>
        </div>
      </div>
      <div class="dataBaseContainer">
        <div class="dataBaseCard">
            <div class="cardLine"></div>
            <div class="cardIcon">
                <el-icon color="#6366f1" size="25px"><Document /></el-icon>
            </div>
             <div class="moreContainer">
                   <!-- 知识库编辑下拉框 -->
                 <el-dropdown placement="bottom">
                <el-icon class="getMore" color="#9ca3af"><MoreFilled /></el-icon>
                 <template #dropdown>
                   <el-dropdown-menu>
                     <el-dropdown-item>删除</el-dropdown-item>
                     <el-dropdown-item>编辑</el-dropdown-item>
                   </el-dropdown-menu>
                 </template>
               </el-dropdown>
            </div>
            <div class="cardName">前端知识库</div>
            <div class="cardDes">这是文化知识库的描述的v拿到了v你说的vv快速注册v农村撒娇的率 v你是当局看不上的v价格多少无关v但是辽宁省vv女生都v你</div>
            <div class="cardOther">
                <div class="leftText">
                     <el-icon color="#9ca3af" size="16px"><Document /></el-icon>
                    <p class="docNum"> 15篇文档</p>
                </div>
               <div class="rightTime">
                 <el-icon color="#9ca3af" size="16px"><Timer /></el-icon>
                <p class="time"> 2025-06-21</p>
               </div>
            </div>
        </div>
          <div class="dataBaseCard">
            <div class="cardLine"></div>
            <div class="cardIcon">
                <el-icon color="#6366f1" size="25px"><Document /></el-icon>
            </div>
             <div class="moreContainer">
                <el-icon class="getMore" color="#9ca3af"><MoreFilled /></el-icon>
            </div>
            <div class="cardName">后台知识库</div>
            <div class="cardDes">这是文化知识库的描述</div>
             <div class="cardOther">
                <div class="leftText">
                     <el-icon color="#9ca3af" size="16px"><Document /></el-icon>
                    <p class="docNum"> 15篇文档</p>
                </div>
               <div class="rightTime">
                 <el-icon color="#9ca3af" size="16px"><Timer /></el-icon>
                <p class="time"> 2025-06-21</p>
               </div>
            </div>
        </div>
          <div class="dataBaseCard">
            <div class="cardLine"></div>
            <div class="cardIcon">
                <el-icon color="#6366f1" size="25px"><Document /></el-icon>
            </div>
            <div class="moreContainer">
                <el-icon class="getMore" color="#9ca3af"><MoreFilled /></el-icon>
            </div>
            <div class="cardName">安卓知识库</div>
            <div class="cardDes">这是文化知识是那些卡死才把四百财富被分成库的描述</div>
             <div class="cardOther">
                <div class="leftText">
                     <el-icon color="#9ca3af" size="16px"><Document /></el-icon>
                    <p class="docNum"> 15篇文档</p>
                </div>
               <div class="rightTime">
                 <el-icon color="#9ca3af" size="16px"><Timer /></el-icon>
                <p class="time"> 2025-06-21</p>
               </div>
            </div>

            
        </div>
  
        
           <div class="addNewCard">
            <div class="detailContainer" @click="dialogFormVisible=true">
                <div class="add">+</div>
                <div class="addDes">创建知识库</div>
                <div class="addDesDetail">创建一个新的知识库来组织您的内容</div>
            </div>
           
          </div>
        
      </div>
   </div>


   <!-- 新建知识库弹出层 -->
  <el-dialog v-model="dialogFormVisible" title="新建知识库" width="500">
    <el-form :model="form"  :rules="rules">
      <el-form-item label="知识库名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="知识库描述" :label-width="formLabelWidth" prop="desc">
         <el-input
            v-model="form.desc"
            style="width: 380px"
            :autosize="{ minRows: 5, maxRows: 8 }"
            type="textarea"
            placeholder="请输入知识库描述"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary"  @click="dialogFormVisible = false">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

.whole-page{
    background: linear-gradient(rgba(230, 230, 250, 0.1)),linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    width: 100%;
    height: 100%;
    padding: 32px;
    overflow: scroll;
    .cardHeader{
        background-color: #fff;
        margin: 0 auto;
        padding: 0 30px;
        width: 98%;
        height: 146px;
        border-radius: 25px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        display: flex;
        justify-content: space-between;
        align-items: center; 
        .des {
            display: flex;
            align-items: center; 
            gap: 19px; 
            .docIcon{
                 display: flex;
               justify-content: center; 
               align-items: center;     
               height: 64px;
               width: 64px;
                background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
                border-radius: 20px;
                box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
            }
            }
            .textDes {
               display: flex;
               flex-direction: column; 
               align-items: flex-start;
               gap: 4px; 
                & > div:first-child{
                  font-size: 32px;
                  font-weight: 800;
                  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
                   background-clip: text;   
                -webkit-background-clip: text;
                 -webkit-text-fill-color: transparent;
               }
               & > div:last-child{
                color: #6b7280;
                font-weight: 500;
               }
            }
             .addNewButton {
             display: flex;
            justify-content: center; 
            align-items: center;    
            height: 56px;
            padding: 0 32px;
            border-radius: 16px;
            font-weight: 700;
            font-size: 16px;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            border: none;
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
            transition: all 0.3s ease;
            color: #fff;
            font-size: 17px;
            cursor: pointer;
             &:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 35px rgba(99, 102, 241, 0.4);
            }
          }
        }
    .dataBaseContainer{
        margin: 30px auto 0;
        width: 98%;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: flex-start ; 
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
        .addNewCard{
              display: flex;
            justify-content: center; 
            align-items: center;    
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.02), rgba(139, 92, 246, 0.02));
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
             flex: 0 0 calc(33.333% - 14px);
            border-radius: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
            height: 250px;
             border: 2px dashed transparent; 
            &:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                    border: 2px dashed var(--primary-color);
                   background: linear-gradient(
                     135deg,
                     rgba(99, 102, 241, 0.05),
                     rgba(139, 92, 246, 0.05)
                   );
            }
            .detailContainer{
                text-align: center;
                .add{
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 20px;
                    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 39px;
                }
                .addDes{
                    font-weight: bold;
                    font-size: 20px;
                }
                .addDesDetail{
                    color: #6b7280;
                    font-size: 14px;
                    margin-top: 12px;
                }
            }
         
            

        }
    }
  
}
::v-deep .el-form-item{
    margin-left: -52px !important;
}
::v-deep .el-button+.el-button{
    background:linear-gradient(135deg, var(--primary-color), var(--primary-light));
    color: #fff;
}
    

</style>
