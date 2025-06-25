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
            <div class="comment-content" v-for="comment of getCommentContent">
                <h3>Total</h3>
                <div class="text">{{ comment.text }}</div>
                <div class="content">{{ comment.content }}</div>
            </div>
        </div>
    </Transition>

</template>
<script lang="ts" setup>
import { ref , onBeforeUnmount ,reactive } from 'vue'
import EventBus from '../utils/event-bus'
import { CloseBold } from '@element-plus/icons-vue'
 
const commentContent = ref('')
const showCommentInput = ref(false);
const showCommentContent = ref(false);
const getCommentContent = ref([])

EventBus.on('showCommentInput',(val)=>{
    showCommentInput.value = val;
    showCommentContent.value = false;
})

EventBus.on('getComment',(val)=>{
    showCommentInput.value = false;
    showCommentContent.value = true;
    getCommentContent.value = [
        {
            text: "秋末的银杏叶落在青石板上，像被揉皱的金箔，风一掀，又轻轻旋起半寸，不肯急着归尘。",
            content: "生命的从容往往藏在“不肯急”里——不必追赶季节的催促，不必慌忙与旧时光告别。飘落不是终点，而是用最舒展的姿态，完成与大地最后的对话。"
        },
        {
            text: "黄昏把云絮染成蜜色时，老座钟的铜摆正晃过第七下，檐角的风铃却比它慢半拍——时间原是有温度的，烫在记忆里就成了琥珀。",
            content: "机械的滴答声丈量的是物理长度，而那些“慢半拍”的温柔时刻，才是时间真正的重量。它不追求精准，只负责把心动、温暖、遗憾都封存在记忆里，成为往后反复摩挲的光。"
        },
        {
            text: "雨夜里的窗灯最是温柔，晕开一团橘色的雾，把雨丝都焐暖了，像有人在等，又像在等的人本身就是暖。",
            content: "等待与被等待从不是单向的消耗。那盏灯既是归人的指引，也是守灯人内心的投射——我们用温暖照亮他人时，自己也早已活成了光的形状。"
        },
        {
            text: "种子顶开第一片土壳时，根须还在黑暗里摸索，它不急着炫耀绿芽，先把影子往地下扎得更深——所有向上的生长，都始于向下的沉淀。",
            content: "世人总爱为“破土”鼓掌，却少有人看见地下根系的沉默。真正的成长从不是急功近利的攀爬，而是先学会在看不见的地方扎根，把脆弱熬成坚韧，再将积累化作向上的力量。"
        },
        {
            text: "星子落进深潭，碎成满池磷火，游鱼衔起一片，又吐在波心——光明从不怕被打碎，它会在每个涟漪里重新亮起来。",
            content: "生活总爱把期待摔成碎片，但光的特质是：碎了便成了千万个小太阳。那些被揉皱的希望、被击散的勇气，终会在某个涟漪里，重新聚成照亮前路的光。"
        }
    ]
})

const confirmComment = () => {
    if (!commentContent.value.trim()) return;
    EventBus.emit('confirmComment',true)
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
        max-height: 10em;
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
            overflow: hidden;
            /* 隐藏溢出内容 */
            display: -webkit-box;
            /* 必须声明为弹性盒模型（旧版） */
            -webkit-box-orient: vertical;
            /* 子元素垂直排列 */
            -webkit-line-clamp: 2;
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