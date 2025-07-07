import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export interface SearchOptions {
  highlightClass?: string
  currentHighlightClass?: string
  caseSensitive?: boolean
  wholeWord?: boolean
  regex?: boolean
}

interface SearchState {
  query: string
  matches: Array<{ from: number; to: number; text: string }>
  currentIndex: number
  options: SearchOptions
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    search: {
      /**
       * 搜索文本
       */
      search: (query: string, options?: SearchOptions) => ReturnType
      /**
       * 清除搜索
       */
      clearSearch: () => ReturnType
      /**
       * 下一个匹配
       */
      nextMatch: () => ReturnType
      /**
       * 上一个匹配
       */
      prevMatch: () => ReturnType
    }
  }
}

// 全局变量存储pluginKey
let searchPluginKey: PluginKey | null = null

// 辅助函数：查找匹配项
// 增加最大匹配数限制，避免极端情况下内存暴涨
function findMatches(doc: any, query: string, options: SearchOptions, maxMatches = 500): Array<{ from: number; to: number; text: string }> {
  const matches: Array<{ from: number; to: number; text: string }> = []
  const { caseSensitive, wholeWord, regex } = options

  if (!query.trim()) return matches

  let searchRegex: RegExp
  if (regex) {
    try {
      searchRegex = new RegExp(query, caseSensitive ? 'g' : 'gi')
    } catch (e) {
      return matches
    }
  } else {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = wholeWord ? `\\b${escapedQuery}\\b` : escapedQuery
    searchRegex = new RegExp(pattern, caseSensitive ? 'g' : 'gi')
  }

  doc.descendants((node: any, pos: number) => {
    if (node.isText) {
      const text = node.text || ''
      let match

      while ((match = searchRegex.exec(text)) !== null) {
        if (matches.length >= maxMatches) break;
        matches.push({
          from: pos + match.index,
          to: pos + match.index + match[0].length,
          text: match[0],
        })
      }
    }
  })

  return matches
}

export const Search = Extension.create<SearchOptions>({
  name: 'search',

  addOptions() {
    return {
      highlightClass: 'search-highlight',
      currentHighlightClass: 'search-highlight-current',
      caseSensitive: false,
      wholeWord: false,
      regex: false,
    }
  },

  addCommands() {
    return {
      search: (query: string, options: SearchOptions = {}) => ({ tr, dispatch, state, commands }) => {
        if (!query.trim()) {
          return commands.clearSearch()
        }

        const searchOptions = { ...this.options, ...options }
        const matches = findMatches(state.doc, query, searchOptions)
        
        if (dispatch && searchPluginKey) {
          tr.setMeta(searchPluginKey, { type: 'search', query, matches, options: searchOptions })
        }
        
        return true
      },

      clearSearch: () => ({ tr, dispatch }) => {
        if (dispatch && searchPluginKey) {
          tr.setMeta(searchPluginKey, { type: 'clear' })
        }
        return true
      },

      nextMatch: () => ({ tr, dispatch, state }) => {
        if (!searchPluginKey) return false
        
        const searchState = searchPluginKey.getState(state) as SearchState
        if (!searchState || !searchState.matches.length) return false

        const nextIndex = searchState.currentIndex + 1 >= searchState.matches.length 
          ? 0 
          : searchState.currentIndex + 1

        if (dispatch) {
          tr.setMeta(searchPluginKey, { type: 'navigate', index: nextIndex })
        }
        return true
      },

      prevMatch: () => ({ tr, dispatch, state }) => {
        if (!searchPluginKey) return false
        
        const searchState = searchPluginKey.getState(state) as SearchState
        if (!searchState || !searchState.matches.length) return false

        const prevIndex = searchState.currentIndex - 1 < 0 
          ? searchState.matches.length - 1 
          : searchState.currentIndex - 1

        if (dispatch) {
          tr.setMeta(searchPluginKey, { type: 'navigate', index: prevIndex })
        }
        return true
      },
    }
  },

  addProseMirrorPlugins() {
    const pluginKey = new PluginKey('search')
    searchPluginKey = pluginKey

    return [
      new Plugin({
        key: pluginKey,
        state: {
          init(): SearchState {
            return {
              query: '',
              matches: [],
              currentIndex: -1,
              options: {},
            }
          },
          apply(tr, value: SearchState): SearchState {
            const meta = tr.getMeta(pluginKey)
            if (!meta) return value

            switch (meta.type) {
              case 'search':
                return {
                  query: meta.query,
                  matches: meta.matches,
                  currentIndex: meta.matches.length > 0 ? 0 : -1,
                  options: meta.options,
                }
              case 'clear':
                return {
                  query: '',
                  matches: [],
                  currentIndex: -1,
                  options: {},
                }
              case 'navigate':
                return {
                  ...value,
                  currentIndex: meta.index,
                }
              default:
                return value
            }
          },
        },
        props: {
          decorations(state) {
            const searchState = pluginKey.getState(state) as SearchState
            if (!searchState || !searchState.matches.length) return DecorationSet.empty

            const decorations: Decoration[] = []
            
            searchState.matches.forEach((match, index) => {
              const isCurrent = index === searchState.currentIndex
              const className = isCurrent 
                ? `${searchState.options.highlightClass} ${searchState.options.currentHighlightClass}`
                : searchState.options.highlightClass

              decorations.push(
                Decoration.inline(match.from, match.to, {
                  class: className,
                })
              )
            })

            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },

  addMethods() {
    return {
      getSearchState(): SearchState | null {
        if (!searchPluginKey) return null
        try {
          return searchPluginKey.getState((this as any).editor?.state) as SearchState || null
        } catch (error) {
          console.warn('Failed to get search state:', error)
          return null
        }
      },

      getCurrentMatchIndex(): number {
        const state = this.getSearchState()
        return state?.currentIndex ?? -1
      },

      getMatchCount(): number {
        const state = this.getSearchState()
        return state?.matches?.length ?? 0
      },

      hasMatches(): boolean {
        return this.getMatchCount() > 0
      },
    }
  },
})