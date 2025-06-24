// comment-extension.js
import { Mark } from '@tiptap/core'

export const Comment = Mark.create({
  name: 'comment', // Mark 名称（唯一标识）

  // 定义 Mark 的属性（存储评论数据）
  addAttributes() {
    return {
      id: {
        default: null, // 评论唯一ID
        parseHTML: (element) => element.getAttribute('data-comment-id'), // 从HTML解析ID
      },
    }
  },

  // 定义 Mark 对应的 HTML 标签和属性（用于序列化/反序列化）
  parseHTML() {
    return [
      {
        tag: 'span[data-comment-id]', // 匹配带 data-comment-id 属性的 span 标签
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // 输出 HTML 时，将评论属性添加到 span 标签
    return [
      'span',
      { 
        ...HTMLAttributes,
        class: 'tiptap-comment', // 自定义类名（用于样式）
        'data-comment-id': HTMLAttributes.id, // 关键：加上 data-comment-id
      },
      0, // 0 表示插入子内容（即被评论的文本）
    ]
  },
  
})