<template>
    <!-- 评论输入弹窗（简化示例，实际可使用模态框） -->
    <div v-show="false" class="comment-input">
        <h3>Total</h3>
        <el-input v-model="commentContent" placeholder="输入评论内容" style="margin-top: 10px;"/>
        <el-button @click="confirmComment" style="margin-top: 10px;">确认</el-button>
        <el-button @click="cancelComment" style="margin-top: 10px;">取消</el-button>
    </div>
    <div v-show="true" class="comment-content">
        <h3>Total</h3>
        <div class="text">hhhhhhhhh</div>
        <div class="content">你是一个可爱的小朋友吗可爱的养乐多哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈hhhhhhhhhhhhhhhhhhhxixixixixixixix</div>
    </div>
</template>
<script lang="ts">

</script>
<style lang="scss" scoped>
.comment-input {
    background: #ffffff; /* 盒子背景色（白色） */
    border-radius: 8px; /* 圆角效果，使盒子更圆润 */
    height: 130px;
    margin-right: 5px;
    margin-left: 5px;
    padding: 10px;
    max-width: 300px;
    border: 1px solid #dddddd;
    box-shadow: 2px 2px 0px 0px rgba(138, 43, 226, 0.3);
    margin-top: 200px;
}
.comment-content{
    background-color: #ffffff;
    border-radius: 8px;
    margin-top: 200px;
    margin-right: 5px;
    margin-left: 5px;
    padding: 10px;
    border: 1px solid #dddddd;
    max-height: 10em;
    max-width: 300px;
    box-shadow: 2px 2px 0px 0px rgba(138, 43, 226, 0.3);
    .text{
        width: 300px;
        border-left: 3px solid #dddddd;
        padding-left: 8px;
        margin: 4px 0;
    }
}
</style>