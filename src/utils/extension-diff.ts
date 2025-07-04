import { mergeAttributes } from '@tiptap/core'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Heading } from '@tiptap/extension-heading'
import { OrderedList } from '@tiptap/extension-ordered-list'
import { BulletList } from '@tiptap/extension-bullet-list'
import { HorizontalRule } from '@tiptap/extension-horizontal-rule'
import { CodeBlock } from '@tiptap/extension-code-block'
import type { Node } from 'prosemirror-model'
import { Blockquote } from '@tiptap/extension-blockquote'
// 公共函数：根据 marks 判断高亮样式
function getDiffAttributes(node: Node) {
  const hasAddMark = node.marks.some(m => m.type.name === 'add')
  const hasRemoveMark = node.marks.some(m => m.type.name === 'remove')

  let style = ''
  let dataDiff = ''

  if (hasAddMark) {
    style += 'background:#d4fcbc;border-left:3px solid #4caf50;padding-left:4px;'
    dataDiff = 'add'
  }

  if (hasRemoveMark) {
    style += 'background:#ffecec;border-left:3px solid #f44336;padding-left:4px;text-decoration:line-through;'
    dataDiff = 'remove'
  }

   const attrs = {
    style: style || undefined,
    'data-diff': dataDiff || undefined,
  }

  return attrs
}

// 扩展段落
export const CustomParagraph = Paragraph.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      'p',
      mergeAttributes(HTMLAttributes, getDiffAttributes(node)),
      0,
    ]
  },
})

// 扩展标题
export const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      `h${node.attrs.level}`,
      mergeAttributes(HTMLAttributes, getDiffAttributes(node)),
      0,
    ]
  },
})

// 扩展有序列表
export const CustomOrderedList = OrderedList.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      'ol',
      mergeAttributes(HTMLAttributes, getDiffAttributes(node)),
      0,
    ]
  },
})

// 扩展无序列表
export const CustomBulletList = BulletList.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      'ul',
      mergeAttributes(HTMLAttributes, getDiffAttributes(node)),
      0,
    ]
  },
})

// 扩展分割线
export const CustomHorizontalRule = HorizontalRule.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      'hr',
      mergeAttributes(HTMLAttributes, getDiffAttributes(node)),
    ]
  },
})

// 扩展代码块
export const CustomCodeBlock = CodeBlock.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(HTMLAttributes, getDiffAttributes(node)),
      ['code', 0],
    ]
  },})

// Blockquote
 export const CustomBlockquote = Blockquote.extend({
  renderHTML({ node, HTMLAttributes }) { 
    return [
      'blockquote',
      mergeAttributes(HTMLAttributes, getDiffAttributes(node)),
      0,
    ]
  }
})