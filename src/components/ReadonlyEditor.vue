<script setup lang="ts">
import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import { AddMark, RemoveMark } from '../utils/extension-diff-mark'
import { watch, ref } from 'vue'
import DOMPurify from 'dompurify'

const props = defineProps<{
  content: string
}>()
console.log(props.content)
const html = ref('')
// 只读编辑器，渲染 HTML 内容
// 监听 content 属性变化，解析 JSON 字符串并生成 HTML
watch(
  () => props.content,
  (val) => {
    try {
      // 兼容对象和字符串
      const json = typeof val === 'string' ? JSON.parse(val) : val
      const rawHtml = generateHTML(json, [
        StarterKit,
        Heading,
        Highlight,
        TextStyle,
        Color,
        Link,
        AddMark,
        RemoveMark,
      ])
      html.value = DOMPurify.sanitize(rawHtml)
    } catch (e) {
      html.value = DOMPurify.sanitize(val || '')
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-html="html"></div>
</template>
