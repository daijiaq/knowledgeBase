<template>
    <div v-if="editor" class="container">
        <div class="button-group">
            <button @click="editor.chain().focus().undo().run()"
                :disabled="!editor.can().chain().focus().undo().run()">
                <span class="iconfont icon-25chehui"></span>
            </button>
            <button @click="editor.chain().focus().redo().run()"
                :disabled="!editor.can().chain().focus().redo().run()">
                <span class="iconfont icon-26quxiaochehui"></span>
            </button>
            <button @click="editor.chain().focus().toggleBold().run()"
                :disabled="!editor.can().chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor.isActive('bold') }">
                <span class="iconfont icon-bold"></span>
            </button>
            <button @click="editor.chain().focus().toggleItalic().run()"
                :disabled="!editor.can().chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor.isActive('italic') }">
                <span class="iconfont icon-italic"></span>
            </button>
            <button @click="editor.chain().focus().toggleStrike().run()"
                :disabled="!editor.can().chain().focus().toggleStrike().run()"
                :class="{ 'is-active': editor.isActive('strike') }">
                <span class="iconfont icon-strikethrough"></span>
            </button>
            <button @click="editor.chain().focus().toggleCode().run()"
                :disabled="!editor.can().chain().focus().toggleCode().run()"
                :class="{ 'is-active': editor.isActive('code') }">
                <span class="iconfont icon-code-view"></span>
            </button>
            <button @click="editor.chain().focus().setParagraph().run()"
                :class="{ 'is-active': editor.isActive('paragraph') }">
                <span class="iconfont icon-duanla"></span>
            </button>
            <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
                <span class="iconfont icon-13biaoti1"></span>
            </button>
            <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
                <span class="iconfont icon-14biaoti2"></span>
            </button>
            <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
                <span class="iconfont icon-15biaoti3"></span>
            </button>
            <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
                <span class="iconfont icon-16biaoti4"></span>
            </button>
            <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
                <span class="iconfont icon-17biaoti5"></span>
            </button>
            <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
                <span class="iconfont icon-18biaoti6"></span>
            </button>
            <button @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'is-active': editor.isActive('bulletList') }">
                <span class="iconfont icon-list-unordered"></span>
            </button>
            <button @click="editor.chain().focus().toggleOrderedList().run()"
                :class="{ 'is-active': editor.isActive('orderedList') }">
                <span class="iconfont icon-list-ordered"></span>
            </button>
            <button @click="editor.chain().focus().toggleCodeBlock().run()"
                :class="{ 'is-active': editor.isActive('codeBlock') }">
                <span class="iconfont icon-daimakuaicodeblock"></span>
            </button>
            <button @click="editor.chain().focus().toggleBlockquote().run()"
                :class="{ 'is-active': editor.isActive('blockquote') }">
                <span class="iconfont icon-double-quotes-l"></span>
            </button>
            <button @click="editor.chain().focus().setHorizontalRule().run()">
                <span class="iconfont icon-split-cells-vertical"></span>
            </button>
            <button @click="editor.chain().focus().setHardBreak().run()">
                <span class="iconfont icon-text-wrap"></span>
            </button>
            <button @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
                <span class="iconfont icon-align-left"></span>
            </button>
            <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
                <span class="iconfont icon-align-center"></span>
            </button>
            <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
                <span class="iconfont icon-align-right"></span>
            </button>
            <button @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
                <span class="iconfont icon-align-justify"></span>
            </button>
            <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">
                <span class="iconfont icon-link"></span>
            </button>
            <button @click="editor.chain().focus().unsetLink().run()" :disabled="!editor.isActive('link')">
                <span class="iconfont icon-link-unlink"></span>
            </button>
            <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }">
                <span class="iconfont icon-font-color"></span>
            </button>
            <el-dropdown placement="top-end" size="small">
                <button>
                    <span class="iconfont icon-24zitiyanse"></span>
                </button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>
                        <button  @click="editor.chain().focus().unsetColor().run()"
                            class="color-picker"
                            :style="{backgroundColor : '#2D2D2D'}"
                        >
                        </button>
                    </el-dropdown-item>
                    <el-dropdown-item v-for="color in fontColors" :key="color">
                        <button  @click="editor.chain().focus().setColor(color).run()"
                            class="color-picker"
                            :style="{backgroundColor : color}"
                        >
                        </button>
                    </el-dropdown-item>
                    
                </el-dropdown-menu>
            </template>
            </el-dropdown>
            <el-dropdown placement="top-end" size="small">
                <button>
                    <span class="iconfont icon-19beijingyanse"></span>
                </button>
            <template #dropdown>
                <el-dropdown-menu>
                <el-dropdown-item v-for="color in highlightColors" :key="color">
                    <button 
                        :style="{ backgroundColor: color }" 
                        @click="editor.chain().focus().setHighlight({ color }).run()"
                        class="color-picker"
                    ></button>
                </el-dropdown-item>
                <el-dropdown-item>
                    <button 
                        :style="{ backgroundColor: '#ffffff' }" 
                        @click="editor.chain().focus().unsetHighlight().run()"
                        class="color-picker"
                    ></button>
                </el-dropdown-item>
                </el-dropdown-menu>
            </template>
            </el-dropdown>
            <el-dropdown placement="top-end" size="small">
                <button><el-icon size="18" style="padding-top: 6px;"><ChatSquare /></el-icon></button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="addComment">
                        添加评论
                    </el-dropdown-item>
                    <el-dropdown-item @click="removeComment">
                        删除评论
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
            </el-dropdown>
        </div>
        <!-- <button @click="saveText">保存</button>
        <button @click="onw">回显</button> -->
        <editor-content :editor="editor" class="editor-content" @click="getComment"/>
        <!-- 评论输入弹窗（简化示例，实际可使用模态框） -->
        <div v-if="showCommentInput" class="comment-input">
            <input v-model="commentContent" placeholder="输入评论内容" />
            <button @click="confirmComment">确认</button>
            <button @click="cancelComment">取消</button>
        </div>
    </div>
</template>

<script setup>
// 引入tiptap包
import { ListItem } from '@tiptap/extension-list-item'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { Comment } from '../utils/comment-extension' // 引入自定义评论扩展
import { useEditor, EditorContent , Editor } from '@tiptap/vue-3'
import { onBeforeUnmount , ref } from 'vue'
import { nanoid } from 'nanoid'
import { ChatSquare } from '@element-plus/icons-vue'

// 预设背景颜色列表
const highlightColors = ref(['#E0F7FA', '#FFF3E0', '#FFF8E1', '#F0F4C3', '#FFE0B2','#EDE7F6'])
// 预设背景颜色列表
const fontColors = ref(['#A8D8EA', '#D8BFD8', '#8B7E74','#958DF1', '#9CA3AF'])
// 当前对齐状态（初始左对齐）
const currentAlignment = ref('left') 
const showCommentInput = ref(false) // 控制评论输入框显示
const commentContent = ref('')      // 评论内容输入
let selectedRange = null            // 保存用户选中的文本范围

const editor = useEditor({
    extensions: [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        Highlight.configure({
            multicolor: true, // 启用多颜色
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Link.configure({
          openOnClick: false,
          defaultProtocol: 'https',
        }),
        StarterKit,
        Underline,
        Comment
    ],
    content: `<h2>Heading</h2>
        <p style="text-align: center">first paragraph</p>
        <p style="text-align: right">second paragraph</p>`,
    onUpdate({ editor }) {
        //自动获取数据内容
        const json = editor.getJSON()
        const html = editor.getHTML()
        console.log(json,html)
    },
})

//建立链接
function setLink() {
    const previousUrl = editor.value.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
    return
    }

    // empty
    if (url === '') {
    editor.value
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run()

    return
    }

    // update link
    editor.value
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: url })
    .run()
}

function saveText(){
    //手动获取文本内容
    console.log(editor.value.getJSON());
}
//回显示例api
function onw(){
    editor.value.commands.setContent({
    "type": "doc",
    "content": [
        {
            "type": "heading",
            "attrs": {
                "level": 1
            },
            "content": [
                {
                    "type": "text",
                    "text": "hello"
                }
            ]
        },
        {
            "type": "paragraph"
        },
        {
            "type": "paragraph",
            "content": [
                {
                    "type": "text",
                    "text": "1112"
                }
            ]
        },
        {
            "type": "horizontalRule"
        },
        {
            "type": "codeBlock",
            "attrs": {
                "language": null
            },
            "content": [
                {
                    "type": "text",
                    "text": "11"
                }
            ]
        }
    ]
})
}

// 添加评论按钮点击事件
const addComment = () => {
    
    const { from, to } = editor.value.state.selection
    console.log(from,to);

  
    if (from === to) {
        alert('请先选中文本！')
        return
    }
    selectedRange = { from, to } // 保存选中范围
    showCommentInput.value = true // 显示输入框
}
 
// 确认评论（保存到编辑器）
const confirmComment = () => {
  if (!commentContent.value.trim()) return
 
  // 生成评论属性
  const attributes = {
    id: nanoid(),
  }
  
  // 应用 Mark 到选中范围
  editor.value.chain()
    .focus()
    .setMark('comment', attributes) // 添加评论 Mark
    .run()
 
  // 重置状态
  showCommentInput.value = false
  commentContent.value = ''
  selectedRange = null
}
 
// 取消评论输入
const cancelComment = () => {
  showCommentInput.value = false
  commentContent.value = ''
  selectedRange = null
}

//获取评论
const getComment = (event) => {
    const { target } = event
    if (!target.classList.contains('tiptap-comment')) return
    // 获取被点击的 comment Mark 的属性
    const commentId = target.getAttribute('id')
    alert(`评论id是${commentId}`);
}


// 删除当前选中范围的评论（示例函数）
const removeComment = () => {
  editor.value.chain()
    .focus()
    .unsetMark('comment') // 移除 comment Mark
    .run()
}


onBeforeUnmount(() => {
    this.editor.destroy()
})

</script>

<style lang="scss">
.container{
    width: 60%;
    margin:0 auto;
    height: 80%;

    .color-picker{
        width: 10px;
        height: 10px;
        :hover{
            border: none;
        }
    }

}
.button-group {
    button {
    /* 默认样式（未激活时） */
    margin: 1px;
    padding: 4px;
    color: #333;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    background-color: #ffffff;
    overflow: hidden;
    /* 激活时样式（is-active 类生效） */
    &.is-active {
      background: #958DF1; /* 示例：紫色背景（与代码中紫色按钮色值一致） */
      color: white; /* 文字反色 */
      border-color: #7a72e0; /* 边框加深 */
      box-shadow: 0 2px 4px rgba(149, 141, 241, 0.2); /* 阴影增强层次感 */
    }
 
    /* 可选：悬停/焦点状态（非激活时） */
    &:not(.is-active):hover {
      background: #E0E0E0;
    }
  }
  text-align: center;
}
/* Basic editor styles */
.tiptap {
    outline: none;
    code {
        font-family: 'Consolas', monospace; /* 等宽字体 */
        background-color: #E0E0E0;
        border-radius: 0.4rem;
        color: var(--black);
        font-size: 0.85rem;
        padding: 0.25em 0.3em;
  }
    pre {
        background: #000000;
        border-radius: 0.5rem;
        color: #ffffff;
        font-family: 'JetBrainsMono', monospace;
        margin: 1.5rem 0;
        padding: 0.75rem 1rem;

        code {
        font-family: 'Consolas', monospace; /* 等宽字体 */
        background-color: #E0E0E0;
        background: none;
        color: inherit;
        font-size: 0.8rem;
        padding: 0;
        }
    }
    blockquote {
        border-left: 3px solid #E0E0E0;
        margin: 1.5rem 0;
        padding-left: 1rem;
    }
    a {
    color: #958DF1;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      color: #8A82E8;
    }
  }
  .tiptap-comment {
        /* 评论文本样式（如添加下划线或背景色） */
        text-decoration: underline;
        text-decoration-color: #2196f3;
        cursor: pointer;
    }
}

.editor-content {
    margin-top: 20px;
    height: 200px;
}
 
.comment-input {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
}
</style>