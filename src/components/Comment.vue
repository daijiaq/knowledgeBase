<template>
    <Transition name="comment-slide">
        <!-- 评论输入弹窗（简化示例，实际可使用模态框） -->
        <div v-show="showCommentInput" class="comment-input">
            <h3>Total</h3>
            <el-input v-model="commentContent" placeholder="输入评论内容" style="margin-top: 10px;" resize="none" :rows="3"
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
            <div class="comment-content" v-for="(comment,index) of getCommentContent" :key="index">
                <h3>{{ comment.username }}</h3>
                <div class="text">{{ text }}</div>
                <div class="content">{{ comment.comment }}</div>
            </div>
        </div>
    </Transition>

</template>
<script lang="ts" setup>
import { ref , onBeforeUnmount } from 'vue'
import EventBus from '../utils/event-bus'
import { CloseBold } from '@element-plus/icons-vue'
import { getCommentApi } from '../api/comment'
 
interface CommentItem {
    username: string;
    text: string;
    comment: string;
}


const commentContent = ref<string>('')
const showCommentInput = ref<boolean>(false);
const showCommentContent = ref<boolean>(false);
const getCommentContent = ref<CommentItem[]>([])
const text = ref<string>('')

EventBus.on('showCommentInput', ((val: boolean) => {
    showCommentInput.value = val;
    showCommentContent.value = false;
} ) as any);

EventBus.on('getComment', (async(val: any) => {
    showCommentInput.value = false;
    showCommentContent.value = true;
    const res = await getCommentApi(val.text_id);
    text.value = val.text;
    getCommentContent.value = res.data;
}))

const confirmComment = async() => {
    if (!commentContent.value.trim()) return;
    EventBus.emit('confirmComment',commentContent.value.trim())
    showCommentInput.value = false;
    commentContent.value = '';
}

const cancelComment = () => {
    EventBus.emit('confirmComment',false);
    showCommentInput.value = false;
    commentContent.value = '';
}

const removeCommentBox = () =>{
    showCommentContent.value = false;
}

onBeforeUnmount(()=>{
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
.comments{
    display: flex;
    flex-direction: column;
    position: relative;
    // margin-top: 180px;
    overflow: scroll;
    scrollbar-width: none;
    padding-top: 15px;
    background-color: pink;
    background-color: #ffffff;
    margin-top: 150px;
    .del{
        position: absolute;
        top: 2px;
        right: 4px;
        cursor: pointer;
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
        max-width: 300px;
        box-shadow: 2px 2px 0px 0px rgba(138, 43, 226, 0.3);
        cursor: pointer;

        .text {
            width: 300px;
            border-left: 3px solid #dddddd;
            padding-left: 8px;
            padding-right: 15px;
            margin: 8px 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #808080;
        }

        .content {
            padding: 3px 5px;
            // overflow: hidden;
            /* 隐藏溢出内容 */
            // display: -webkit-box;
            /* 必须声明为弹性盒模型（旧版） */
            // -webkit-box-orient: vertical;
            /* 子元素垂直排列 */
            // -webkit-line-clamp: 2;
            /* 限制显示的行数（可修改为其他数值） */
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