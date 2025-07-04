<template>
    <div class="user">
        <span class="username">{{ props.comment.username }}</span><span class="del-comment" v-if="userId === props.comment.userId"><el-icon @click="deleteComment" :data-commentId="props.comment.id"><Delete /></el-icon></span>
    </div>
    <!-- <div class="text">{{ text }}</div> -->
    <div class="content">{{ props.comment.comment }}<span class="comment-unfold" @click="replyComment">回复</span></div>
    <div class="reply-comment" v-show="showReplyComment">
        <div class="user">
            <span style="font-weight: 600;">test回复test2</span>
            <span class="del-comment"><el-icon @click="deleteComment"><Delete /></el-icon></span>
        </div>
        <div class="content">你好我是回复评论<span class="comment-unfold">回复</span></div>
    </div>
    <span class="comment-unfold" @click="showReplyComment = true">展开剩余16条回复评论</span>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Delete } from '@element-plus/icons-vue'

const props = defineProps<{
  comment: {
    id: number | string
    username: string
    comment: string
    userId: number
  },
  userId:number,
}>()
console.log(props);

const showReplyComment = ref<boolean>(false)

// 定义 emit
const emit = defineEmits<{
  (e: 'delete', id: number | string): void,
  (e:'reply', targetName: string, targetCommentId: number):void
}>()

const deleteComment = () => {
  emit('delete', props.comment.id)
}

const replyComment = () => {
    emit('reply','test',11);
}

</script>
<style lang="scss">
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
    font-size: 12px;
    color: #7a72e0;
}
.reply-comment {
    margin-left: 20px;
}
</style>