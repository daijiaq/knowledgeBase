import { Paragraph } from '@tiptap/extension-paragraph';
import { mergeAttributes } from '@tiptap/core';

export const CustomParagraph = Paragraph.extend({
  renderHTML({ node, HTMLAttributes }) {
    // 检查段落是否有 add 或 remove 标记
    const hasAddMark = node.marks.some((m: any) => m.type.name === 'add') 
    const hasRemoveMark = node.marks.some((m: any) => m.type.name === 'remove') 
    
    // 根据标记类型生成对应的样式和类名
    let className = '' 
    let style = '' 
    let dataDiff = '' 
    
    if (hasAddMark) {
      className += 'diff-add-paragraph'
      style += 'background:#d4fcbc;border-left:3px solid #4caf50;padding-left:4px;'
      dataDiff = 'add'
    }
    
    if (hasRemoveMark) {
      className += ' diff-remove-paragraph' // 确保多个类名分隔
      style += 'background:#ffecec;border-left:3px solid #f44336;padding-left:4px;text-decoration:line-through;'
      dataDiff = 'remove'
    }
    
    // 生成段落标签 <p>
    return [
      'p',
      mergeAttributes(HTMLAttributes, {
        class: className.trim() || undefined, // 避免空字符串
        style: style.trim() || undefined,     // 避免空字符串
        'data-diff': dataDiff || undefined    // 避免空字符串
      }),
      0
    ]
  }
})