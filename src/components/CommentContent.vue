<template>
    <div class="user">
        <span class="username">{{ props.comment.username }}</span>
        <span class="del-comment" v-if="userId === props.comment.userId" @click="deleteComment" :data-comment-id="props.comment.id">
            删除
        </span>
    </div>
    <!-- <div class="text">{{ text }}</div> -->
    <div class="content">{{ props.comment.comment }}<span class="comment-unfold" @click="replyComment" :data-user-name="props.comment.username" :data-comment-id="props.comment.id">回复</span></div>
    <div class="reply-comment" v-if="showReplyComment" v-for="(childComment,index) of getChildComment" :key="index">
        <div class="user">
            <span style="font-weight: 600;" v-if="childComment.parentId == props.comment.id">{{childComment.username}}</span>
            <span style="font-weight: 600;" v-else>{{childComment.username}}回复{{ childComment.fatherName }}</span>
            <span class="del-comment" @click="deleteComment" :data-comment-id="childComment.id" v-if="childComment.userId == userId">删除</span>
        </div>
        <div class="content">{{ childComment.comment }}<span class="comment-unfold"  @click="replyComment" :data-user-name="childComment.username" :data-comment-id="childComment.id">回复</span></div>
    </div>
    <span
        class="comment-unfold"
        v-if="count > 0"
        @click="() => { showReplyComment = true; page++; }"
    >展开剩余{{count}}条回复评论</span>
</template>
<script setup lang="ts">
import { computed, ref , watch } from 'vue'
import { getChildCommentApi } from '../api/comment';

const pageSize = 5;
const page = ref<number>(0);
const total = ref<number>(0)

const getChildComment = ref<Array<any>>([])

const count = computed(()=>{
    if(page.value === 0){
        return props.comment.childCount;
    }else{
        return total.value - page.value * pageSize;
    }
})

watch(()=> page.value, async(newPage,oldPage)=>{
    if(oldPage < newPage){
        const res = await getChildCommentApi(Number(props.comment.id),newPage,pageSize)
        getChildComment.value.push(...res.data);
        console.log(getChildComment.value);
        total.value = res.total;
    }
})

const props = defineProps<{
  comment: {
    id: number | string
    username: string
    comment: string
    userId: number
    childCount: number
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

const deleteComment = (event:any) => {
    console.log(event.target.dataset.commentId);
    emit('delete', event.target.dataset.commentId);
    getChildComment.value = getChildComment.value.filter(item=>item.id != event.target.dataset.commentId);
}

const replyComment = async(event: any) => {
    emit('reply',event.target.dataset.userName,event.target.dataset.commentId);
    page.value = 0;
    getChildComment.value = [];
    console.log(getChildComment.value);
    
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
    font-size: 12px;
    color: red;
}
.comment-unfold{
    font-size: 12px;
    color: #7a72e0;
}
.reply-comment {
    margin-left: 20px;
}
</style>