import { Mark, markInputRule } from '@tiptap/core'

export const AddMark = Mark.create({
  name: 'add',
  parseHTML() {
    return [{ tag: 'span[data-diff="add"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', { ...HTMLAttributes, style: 'background:#d4fcbc;', 'data-diff': 'add' }, 0]
  },
})

export const RemoveMark = Mark.create({
  name: 'remove',
  parseHTML() {
    return [{ tag: 'span[data-diff="remove"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', { ...HTMLAttributes, style: 'background:#ffecec;text-decoration:line-through;', 'data-diff': 'remove' }, 0]
  },
})