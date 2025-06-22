<template>
    <div v-if="editor" class="container">
        <div class="control-group">
            <div class="button-group">
                <button @click="editor.chain().focus().toggleBold().run()"
                    :disabled="!editor.can().chain().focus().toggleBold().run()"
                    :class="{ 'is-active': editor.isActive('bold') }">
                    加粗
                </button>
                <button @click="editor.chain().focus().toggleItalic().run()"
                    :disabled="!editor.can().chain().focus().toggleItalic().run()"
                    :class="{ 'is-active': editor.isActive('italic') }">
                    斜体
                </button>
                <button @click="editor.chain().focus().toggleStrike().run()"
                    :disabled="!editor.can().chain().focus().toggleStrike().run()"
                    :class="{ 'is-active': editor.isActive('strike') }">
                    删除
                </button>
                <button @click="editor.chain().focus().toggleCode().run()"
                    :disabled="!editor.can().chain().focus().toggleCode().run()"
                    :class="{ 'is-active': editor.isActive('code') }">
                    代码
                </button>
                <button @click="editor.chain().focus().unsetAllMarks().run()">Clear marks</button>
                <button @click="editor.chain().focus().clearNodes().run()">Clear nodes</button>
                <button @click="editor.chain().focus().setParagraph().run()"
                    :class="{ 'is-active': editor.isActive('paragraph') }">
                    段落
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
                    H1
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
                    H2
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
                    H3
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
                    H4
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
                    H5
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
                    H6
                </button>
                <button @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'is-active': editor.isActive('bulletList') }">
                    无序列表
                </button>
                <button @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'is-active': editor.isActive('orderedList') }">
                    有序列表
                </button>
                <button @click="editor.chain().focus().toggleCodeBlock().run()"
                    :class="{ 'is-active': editor.isActive('codeBlock') }">
                    代码块
                </button>
                <button @click="editor.chain().focus().toggleBlockquote().run()"
                    :class="{ 'is-active': editor.isActive('blockquote') }">
                    块引用
                </button>
                <button @click="editor.chain().focus().setHorizontalRule().run()">分割线</button>
                <button @click="editor.chain().focus().setHardBreak().run()">换行</button>
                <button @click="editor.chain().focus().undo().run()"
                    :disabled="!editor.can().chain().focus().undo().run()">
                    上一步
                </button>
                <button @click="editor.chain().focus().redo().run()"
                    :disabled="!editor.can().chain().focus().redo().run()">
                    下一步
                </button>
                <button @click="editor.chain().focus().setColor('#958DF1').run()"
                    :class="{ 'is-active': editor.isActive('textStyle', { color: '#958DF1' }) }">
                    紫色
                </button>
            </div>
        </div>
        <button @click="saveText">保存</button>
        <button @click="onw">回显</button>
        <editor-content :editor="editor" class="editor-content"/>
    </div>
</template>

<script setup>
// 引入tiptap包
import { ListItem } from '@tiptap/extension-list-item'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent , Editor } from '@tiptap/vue-3'
import { onBeforeUnmount } from 'vue'


const editor = useEditor({
    extensions: [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit,
    ],
    content: `<h1>hello<h1/>`,
    onUpdate({ editor }) {
        //自动获取数据内容
        const json = editor.getJSON()
        console.log(json)
    },
})
function saveText(){
    //手动获取文本内容
    console.log(editor.value.getJSON());
}
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
onBeforeUnmount(() => {
    this.editor.destroy()
})

</script>

<style lang="scss">
.button-group {
    button {
    /* 默认样式（未激活时） */
    padding: 0.5rem 1rem;
    border: 1px solid #e0e0e0;
    background: #f5f5f5;
    color: #333;
    cursor: pointer;
    transition: all 0.2s;
 
    /* 激活时样式（is-active 类生效） */
    &.is-active {
      background: #958DF1; /* 示例：紫色背景（与代码中紫色按钮色值一致） */
      color: white; /* 文字反色 */
      border-color: #7a72e0; /* 边框加深 */
      box-shadow: 0 2px 4px rgba(149, 141, 241, 0.2); /* 阴影增强层次感 */
    }
 
    /* 可选：悬停/焦点状态（非激活时） */
    &:not(.is-active):hover {
      background: #eee;
    }
  }
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
    
}
.editor-content {
    margin-top: 20px;
    height: 200px;
}
</style>