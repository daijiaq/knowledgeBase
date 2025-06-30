<script setup lang="ts">
import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { AddMark, RemoveMark } from '../utils/extension-diff-mark'
import { watch, ref } from 'vue'
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
      // 解析为 tiptap JSON
      const json = typeof val === 'string' ? JSON.parse(val) : val
      html.value = generateHTML(json, [
        StarterKit,
        TextStyle,
        Color,
        AddMark,
        RemoveMark,
      ])
    } catch (e) {
      // 不是 JSON，则直接当作 HTML 或纯文本显示
      html.value = val || ''
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-html="html"></div>
</template>
