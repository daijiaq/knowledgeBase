<script setup lang="ts">
import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { AddMark, RemoveMark } from '../utils/extension-diff-mark'
import { watch, ref } from 'vue'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { ListItem } from '@tiptap/extension-list-item'
import DomPurify from 'dompurify'
import { CustomParagraph,CustomOrderedList,CustomBulletList,CustomCodeBlock,CustomHeading,CustomHorizontalRule,CustomBlockquote } from '../utils/extension-diff'
import CodeBlock from '@tiptap/extension-code-block';
import Code from '@tiptap/extension-code'; // 代码块内文本的标记扩展
import HorizontalRule from '@tiptap/extension-horizontal-rule'

const props = defineProps<{
  content: string
}>()

const html = ref('')



// 在生成HTML前调用
watch(
  () => props.content,
  (val) => {
    try {
      const json = typeof val === 'string' ? JSON.parse(val) : val;
      const cleanedJson = JSON.parse(JSON.stringify(json));
      
      cleanEmptyColor(cleanedJson);
      
      const rawHtml = generateHTML(cleanedJson, [
        StarterKit,
        CodeBlock, 
        HorizontalRule, 
        Code,
        TextStyle,
        Underline.configure({ HTMLAttributes: { class: 'underline' } }),
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        Highlight,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Link,
        AddMark,
        RemoveMark,
        CustomParagraph,
        CustomHeading,
        CustomCodeBlock,
        CustomOrderedList,
        CustomBulletList,
        CustomBlockquote,
        CustomHorizontalRule
      ]);
      
      html.value = DomPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
          'a', 'b', 'i', 'em', 'strong', 'u', 'span', 'br',
          'p', 'ul', 'ol', 'li', 'blockquote', 'code',
          'pre', 'div','h1', 'h2', 'h3', 'h4', 'h5', 'h6' ,
          'hr', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
        ],
        ALLOWED_ATTR: ['href', 'style', 'class', 'data-diff', 'data-type', 'data-id', 'target'],
      });
    } catch (e) {
      console.error('解析内容出错:', e);
    }
  },
  { immediate: true }
)


function cleanEmptyColor(obj: any, path = '') {
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => cleanEmptyColor(item, `${path}[${index}]`))
  } else if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj.marks)) {
      
      // 过滤掉 color 为空的 textStyle避免无意义的 mark 干扰渲染
      obj.marks = obj.marks.filter(
        (m: any) => !(m.type === 'textStyle' && m.attrs && m.attrs.color === '')
      )
      
      // 如果 marks 变成空数组，直接删除 marks 属性
      if (obj.marks.length === 0) {
        delete obj.marks
      }
    }
    
    // 递归处理对象的所有属性
    Object.entries(obj).forEach(([key, value]) => {
      cleanEmptyColor(value, `${path}.${key}`)
    })
  }
}

</script>

<template>
  <div class="tiptap">
    <div class="readonly-content" v-html="html"></div>
  </div>
</template>


<style scoped lang="scss">
.tiptap {
  outline: none;
  h1 {
    font-size: 30px;
  }
  hr {
    margin: 15px 0;
  }
  li {
    margin-left: 20px;
  }
  code {
    font-family: "Consolas", monospace; /* 等宽字体 */
    background-color: #e0e0e0;
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }
  pre {
    background: #000000;
    border-radius: 0.5rem;
    color: #ffffff;
    font-family: "JetBrainsMono", monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      font-family: "Consolas", monospace; /* 等宽字体 */
      background-color: #e0e0e0;
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }
  blockquote {
    border-left: 3px solid #e0e0e0;
    color: #595959;
    margin: 1.5rem 0;
    padding-left: 1rem;
  }
  a {
    color: #958df1;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      color: #8a82e8;
    }
  }
  .tiptap-comment {
    text-decoration: underline;
    text-decoration-color: #2196f3;
    cursor: pointer;
  }
  .search-highlight {
    background-color: #fffbcd; /* 黄色背景 */
    border-radius: 2px;
    padding: 0 2px;
  }
  ::selection {
    background-color: #958df1;
    color: #ffffff;
  }

  ::-moz-selection {
    background-color: #958df1;
    color: #ffffff;
  }
}
hr[data-diff="add"] {
  border: none;
  border-top: 4px solid #4caf50;
  margin: 8px 0;
}

hr[data-diff="remove"] {
  border: none;
  border-top: 4px solid #f44336;
  margin: 8px 0;
}

</style>