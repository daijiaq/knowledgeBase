<template>
   <div v-if="!hydrated" class="main-loading">
        <el-skeleton :rows="3" animated />
    </div>
    <template v-else>
        <Transition name="comment-slide">
            <!-- 评论输入弹窗（简化示例，实际可使用模态框） -->
            <div v-show="showCommentInput" class="comment-input">
                <span style="font-weight: 600;font-size: 20px;">{{ userName }}</span>
                <el-dropdown  style="float: right;font-size: 20px;" placement="top">
                    <span class="emoji">&#127773;</span>
                    <template #dropdown>
                    <el-dropdown-menu style="width: 300px;">
                        <span v-for="emoji of emojis" class="emoji" @click="addEmoji(emoji)">
                            {{ emoji }}
                        </span>
                    </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-input v-model="commentContent" :placeholder="placeholder" style="margin-top: 10px;" resize="none" :rows="3"
                    type="textarea" />
                <el-button @click="confirmComment" style="margin-top: 10px;">确认</el-button>
                <el-button @click="cancelComment" style="margin-top: 10px;">取消</el-button>
            </div>
        </Transition>
        <Transition name="comment-slide">
            <div v-show="showCommentContent" class="comments">
                <div class="del" @click="removeCommentBox">
                    <el-icon>
                        <CloseBold />
                    </el-icon>
                </div>
                <div v-if="getCommentContent.length === 0" class="comment-empty"><el-icon size="30"><MessageBox /></el-icon>
                    <div style="font-size: 12px;">评论区空空如也~</div>
                </div>
                <div class="comment-content" v-for="(comment,index) of getCommentContent" :key="index" v-else>
                    <CommentContent :comment="comment" :userId="userId" @delete="deleteComment" @reply="replyComment"/>
                </div>
            </div>
        </Transition>
    </template>
</template>
<script lang="ts" setup>
import { ref , onBeforeUnmount , onMounted } from 'vue'
import EventBus from '../utils/event-bus'
import { CloseBold, MessageBox } from '@element-plus/icons-vue'
import { getCommentApi, removeCommentApi } from '../api/comment'
import { getUserInfo } from '../api/user'
 
interface CommentItem {
    username: string;
    comment: string;
    userId:number;
    id: number;
}

const emojis = ["😀", "😁", "😂", "😃", "😄", "😅", "😆", "😇", "😈", "😉", "😊", "😋", "😌", "😍", "😎", "😏", "😐", "😑", "😒", "😓", "😔", "😕", "😖", "😗", "😘", "😙", "😚", "😛", "😜", "😝", "😞", "😟", "😠", "😡", "😢", "😣", "😤", "😥", "😦", "😧", "😨", "😩", "😪", "😫", "😬", "😭", "😮", "😯", "😰", "😱", "😲", "😳", "😴", "😵", "😶", "😷", "🙁", "🙂", "🙃", "🙄", "🤐", "🤑", "🤒", "🤓", "🤔", "🤕", "🤠", "🤡", "🤢", "🤣", "🤤", "🤥", "🤧", "🤨", "🤩", "🤪", "🤫", "🤬", "🤭", "🤮", "🤯", "🧐"]

const commentContent = ref<string>('')
const showCommentInput = ref<boolean>(false);
const showCommentContent = ref<boolean>(false);
const getCommentContent = ref<CommentItem[]>([])
const userName = ref<string>("")
const userId = ref<number>(0)
const hydrated = ref<boolean>(false)
const placeholder = ref<string>('请输入评论内容')
const commentReplyId = ref<number>(0)
//false -> 表示对文本评论
//true-> 回复评论
const replyType = ref<boolean>(false)
EventBus.on('showCommentInput', ((val: boolean) => {
    showCommentContent.value = false;
    showCommentInput.value = val;
} ) as any);

EventBus.on('getComment', (async(val: any) => {
    showCommentInput.value = false;
    showCommentContent.value = true;
    const res = await getCommentApi(val.text_id);
    getCommentContent.value = res.data;
}))

const addEmoji = (emoji:string) => {
    commentContent.value = commentContent.value + emoji;
}

const confirmComment = async() => {
    if (!commentContent.value.trim()) return;
    if(!replyType.value){
        EventBus.emit('confirmComment',commentContent.value.trim())
    }else{
        //调用回复评论函数
        //commentId -> 回复目标id
        console.log(commentReplyId.value,'我要被回复');
    }
    showCommentInput.value = false;
    commentContent.value = '';
    replyType.value = false;
}

const cancelComment = () => {
    EventBus.emit('confirmComment',false);
    showCommentInput.value = false;
    commentContent.value = '';
}

const removeCommentBox = () =>{
    showCommentContent.value = false;
}

const deleteComment = async(id:number|string) =>{
    let CommentId = Number(id);
    const res = await removeCommentApi(CommentId);
    if(res.code === 200){
        getCommentContent.value = getCommentContent.value.filter(comment => comment.id !== id);
        ElMessage.success('删除成功');
    }else{
        ElMessage.error('删除失败');
    }
}
const replyComment = async(targetName:string,commentId:number) => {
    replyType.value = true;
    showCommentContent.value = false;
    showCommentInput.value = true;
    placeholder.value = `回复${targetName}`;
    commentReplyId.value = commentId;

}

onMounted(async() => {
     hydrated.value = true
    //获取我的个人信息
    const res = await getUserInfo();
    userId.value = res.data.id;
    userName.value = res.data.username;
}),

onBeforeUnmount(()=>{
    showCommentInput.value = false;
    showCommentContent.value = false;
    //取消全部监听
    EventBus.all.clear();
})

</script>
<style lang="scss" scoped>
.comment-input {
    // transition: all .7s;
    background: #ffffff; /* 盒子背景色（白色） */
    border-radius: 8px; /* 圆角效果，使盒子更圆润 */
    height: 170px;
    margin-right: 5px;
    margin-left: 5px;
    padding: 10px;
    max-width: 300px;
    border: 1px solid #dddddd;
    box-shadow: 2px 2px 0px 0px rgba(138, 43, 226, 0.3);
    margin-top: 200px;
    /* 触发进入动画 */
    .is-enter {
        animation: slideIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    /* 触发离开动画 */
    .is-leaving {
        animation: slideOut 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
    }
    :deep(el-input){
        height: auto;
    }
}

.emoji {
    font-size: 20px;
    cursor: pointer;
}
.comments{
    display: flex;
    flex-direction: column;
    position: relative;
    // margin-top: 180px;
    overflow: scroll;
    scrollbar-width: none;
    padding-top: 15px;
    background-color: #ffffff;
    margin-top: 150px;
    .del{
        position: absolute;
        top: 2px;
        right: 4px;
        cursor: pointer;
    }
    .comment-empty {
        width: 300px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .comment-content {
        background-color: #ffffff;
        border-radius: 8px;
        margin-top: 5px;
        margin-right: 5px;
        margin-left: 5px;
        padding: 10px;
        border: 1px solid #dddddd;
        // max-height: 10em;
        width: 290px;
        word-break: break-all;
        white-space: normal;
        overflow-wrap: break-word;
        box-shadow: 2px 2px 0px 0px rgba(138, 43, 226, 0.3);
        cursor: pointer;

        /* .text {
            width: 300px;
            border-left: 3px solid #dddddd;
            padding-left: 8px;
            padding-right: 15px;
            margin: 8px 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #808080;
        } */

        .content {
            padding: 3px 5px;
        }
        .username{
            font-size: 16px;
            font-weight: 600;
        }
        .del-comment{
            float: right;
        }
        .comment-unfold{
            font-size: 13px;
            color: #7a72e0;
        }
    }
    
}
/* 进入动画：激活状态（贯穿整个进入过程） */
.comment-slide-enter-active {
    animation: slideIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* 离开动画：激活状态（贯穿整个离开过程） */
.comment-slide-leave-active {
    animation: slideOut 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
}

/* 进入动画关键帧 */
@keyframes slideIn {
    0% {
        transform: translateX(100%);
        opacity: 0;
    }

    80% {
        transform: translateX(-5%);
    }

    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

/* 离开动画关键帧 */
@keyframes slideOut {
    0% {
        transform: translateX(0);
        opacity: 1;
    }

    20% {
        transform: translateX(5%);
        /* 轻微过冲增强弹性感 */
    }

    100% {
        transform: translateX(100%);
        opacity: 0;
    }
}
</style>