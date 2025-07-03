import { Mark } from '@tiptap/core'

export const AddMark = Mark.create({
  name: 'add',
  parseHTML() {
    return [{ tag: 'span[data-diff="add"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    // 给 span 加类名，方便整段样式
    return [
      'span',
      {
        ...HTMLAttributes,
        class: (HTMLAttributes.class || '') + ' diff-add',
        style: 'background:#d4fcbc;' + (HTMLAttributes.style ? HTMLAttributes.style : ''),
        'data-diff': 'add'
      },
      0
    ]
  },
})

export const RemoveMark = Mark.create({
  name: 'remove',
  parseHTML() {
    return [{ tag: 'span[data-diff="remove"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      {
        ...HTMLAttributes,
        class: (HTMLAttributes.class || '') + ' diff-remove',
        style: 'background:#ffecec;text-decoration:line-through;' + (HTMLAttributes.style ? HTMLAttributes.style : ''),
        'data-diff': 'remove'
      },
      0
    ]
  },
})