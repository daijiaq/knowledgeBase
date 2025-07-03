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
import { CustomParagraph } from '../utils/extension-diff-p'
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
      // 关键：标记段落级标记
      console.log('清理前的JSON:', cleanedJson);
      
      const rawHtml = generateHTML(cleanedJson, [
        StarterKit,
        TextStyle,
        Underline.configure({ HTMLAttributes: { class: 'underline' } }),
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        Highlight,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Link,
        AddMark,
        RemoveMark,
        CustomParagraph
      ]);
      
      html.value = DomPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
          'a', 'b', 'i', 'em', 'strong', 'u', 'span', 'br',
          'p', 'ul', 'ol', 'li', 'blockquote', 'code',
          'pre', 'div','h1', 'h2', 'h3', 'h4', 'h5', 'h6' 
        ],
        ALLOWED_ATTR: ['href', 'style', 'class', 'data-diff'] 
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
        console.log(`删除空标记 ${path}.marks`)
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
  <div>
    <div class="readonly-content" v-html="html"></div>
  </div>
</template>

<style>
</style>