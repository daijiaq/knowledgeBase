// 自定义扩展
import { Extension, Editor } from '@tiptap/core';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { TextSelection,Plugin } from 'prosemirror-state';
import EventBus from './event-bus' 

interface Match {
  from: number;
  to: number;
}

interface SearchWorkerMessage {
  requestId: number;
  matches: Match[];
}

interface SearchOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
}

interface SearchStorage {
  matches: Match[];
  currentIndex: number;
  pendingRequest: number | null;
  searchText: string;
}


let worker: Worker | null = null;
export const Search = Extension.create({
  name: 'search',

  addOptions() {
    return {
      highlightClass: 'search-highlight',
      currentHighlightClass: 'search-highlight-current',
      caseSensitive: false,
      wholeWord: false,
    };
  },

  // 类型声明
  storage: {} as SearchStorage,
  editor: null as Editor | null,

   // 初始化时添加状态存储（用于记录匹配结果和当前索引）
  addStorage() {
    return {
      matches: [], // 所有匹配项的位置信息（格式：{ from: number, to: number }[]）
      currentIndex: -1, // 当前选中的匹配项索引
      pendingRequest: null,
      searchText: '',
    };
  },
  
  // 添加键盘快捷方式（可选：如 Ctrl+F 触发搜索面板）
  addKeyboardShortcuts() {
    return {
      'Mod-F': () => {
        window.dispatchEvent(new CustomEvent('search:open')); // 触发自定义事件，打开搜索面板
        return true;
      },
      'Mod-G': () => {
        (this as any).nextMatch();
        return true;
      },
      'Mod-Shift-G': () => {
        (this as any).prevMatch();
        return true;
      },
      'Escape': () => {
        (this as any).clearSearch();
        return true;
      },
    };
  },
  
  onCreate() {
    if (!worker) {
      worker = new Worker(new URL('./search-worker.js', import.meta.url), { type: 'module' });
      worker.onmessage = (e: MessageEvent<SearchWorkerMessage>) => {
        const { requestId, matches } = e.data;
        // console.log('主线程收到 worker 匹配结果:', matches);
        console.log('搜索扩展 - 收到Worker响应:', { requestId, matches, pendingRequest: this.storage.pendingRequest });
        
        if (requestId !== this.storage.pendingRequest && this.storage.pendingRequest !== null) {
          console.log(requestId,this.storage.pendingRequest);
          
          console.log('搜索扩展 - 请求ID不匹配，忽略响应');
          return;
        }
        
        this.storage.matches = matches;
        this.storage.currentIndex = -1;
        console.log('搜索扩展 - 更新存储:', { matches: this.storage.matches, currentIndex: this.storage.currentIndex });
        
        this.editor?.view.dispatch(this.editor.state.tr); // 触发视图更新
        // 如需通知外部，请用事件总线或回调，不要用 this.editor.emit
        // 例如：window.dispatchEvent(new CustomEvent('search:results', { detail: matches }));
        console.log('搜索扩展 - 发送搜索结果事件:', matches);
        EventBus.emit('search:result', { detail: matches });
      };
    }

    // Store the worker in a variable outside the extension instance
    this.storage = {
      matches: [],
      currentIndex: -1,
      pendingRequest: null,
      searchText: '',
    };
  
    console.log('搜索扩展 - onCreate 被调用');
    console.log('搜索扩展 - 编辑器实例:', this.editor);
  
    // 将搜索方法暴露给editor实例
    if (this.editor) {
      console.log('搜索扩展 - 暴露搜索方法给编辑器');
      const extension = this;
      (this.editor as any).search = {
        search: (text: string, options?: Partial<SearchOptions>) => {
          console.log('搜索扩展 - 通过编辑器调用搜索:', text);
          
          if (!text) {
            extension.storage.matches = [];
            extension.storage.currentIndex = -1;
            extension.storage.searchText = '';
            extension.storage.pendingRequest = null;
            extension.editor?.view.dispatch(extension.editor.state.tr);
            EventBus.emit('search:clear');
            return;
          }
          
          extension.storage.searchText = text;
          console.log('搜索扩展 - 搜索文本:', text);
          console.log('搜索扩展 - 选项:', options);
          
          const requestId = Date.now();
          extension.storage.pendingRequest = requestId;
          const docJson = extension.editor?.getJSON();
          
          console.log('搜索扩展 - 编辑器实例:', extension.editor);
          console.log('搜索扩展 - 文档JSON:', docJson);
          console.log('搜索扩展 - 文档类型:', typeof docJson);
          console.log('搜索扩展 - 文档内容:', JSON.stringify(docJson, null, 2));
          
          if (!docJson) {
           
            return;
          }
          
          // 检查文档是否有内容
          if (!docJson.content || !Array.isArray(docJson.content) || docJson.content.length === 0) {
            console.warn('搜索扩展 - 文档内容为空');
            return;
          }
          
          const message = {
            requestId,
            doc: docJson,
            text,
            options: {
              caseSensitive: options?.caseSensitive ?? extension.options.caseSensitive,
              wholeWord: options?.wholeWord ?? extension.options.wholeWord,
            } as SearchOptions,
          };
          
          console.log('搜索扩展 - 发送消息给Worker:', message);
          
          (worker as Worker | null)?.postMessage(message);
        },
        clearSearch: () => {
          console.log('搜索扩展 - 通过编辑器调用清除搜索');
          extension.storage.matches = [];
          extension.storage.currentIndex = -1;
          extension.storage.searchText = '';
          extension.storage.pendingRequest = null;
          extension.editor?.view.dispatch(extension.editor.state.tr);
          EventBus.emit('search:clear');
        },
        nextMatch: () => {
          console.log('搜索扩展 - 通过编辑器调用下一个匹配');
          const { matches, currentIndex } = extension.storage;
          if (!matches || matches.length === 0) return;
          const nextIndex = currentIndex + 1 >= matches.length ? 0 : currentIndex + 1;
          
          if (nextIndex < 0 || nextIndex >= matches.length) return;
          const { from, to } = matches[nextIndex];
          extension.storage.currentIndex = nextIndex;
          if (extension.editor) {
            const { state, view } = extension.editor;
            const tr = state.tr.setSelection(TextSelection.create(state.doc, from, to));
            view.dispatch(tr);
            view.focus();
            // 滚动到匹配位置
            const dom = view.nodeDOM(from) as HTMLElement;
            if (dom) {
              dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        },
        prevMatch: () => {
          console.log('搜索扩展 - 通过编辑器调用上一个匹配');
          const { matches, currentIndex } = extension.storage;
          if (!matches || matches.length === 0) return;
          const prevIndex = currentIndex - 1 < 0 ? matches.length - 1 : currentIndex - 1;
          
          if (prevIndex < 0 || prevIndex >= matches.length) return;
          const { from, to } = matches[prevIndex];
          extension.storage.currentIndex = prevIndex;
          if (extension.editor) {
            const { state, view } = extension.editor;
            const tr = state.tr.setSelection(TextSelection.create(state.doc, from, to));
            view.dispatch(tr);
            view.focus();
            // 滚动到匹配位置
            const dom = view.nodeDOM(from) as HTMLElement;
            if (dom) {
              dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        },
        getMatchCount: () => extension.storage.matches.length,
        getCurrentMatchIndex: () => extension.storage.currentIndex,
        getSearchText: () => extension.storage.searchText,
        hasMatches: () => extension.storage.matches.length > 0,
      };
    } else {
      console.warn('搜索扩展 - 编辑器实例不存在，无法暴露方法');
    }
  
    // console.log(this.editor)
    
  },
  
  onUpdate() {
    // 确保搜索方法始终可用
    console.log('搜索扩展 - onUpdate 被调用');
    if (this.editor) {
      console.log('搜索扩展 - 重新暴露搜索方法给编辑器');
      const extension = this;
      (this.editor as any).search = {
        search: (text: string, options?: Partial<SearchOptions>) => {
          console.log('搜索扩展 - 通过编辑器调用搜索:', text);
          
          if (!text) {
            extension.storage.matches = [];
            extension.storage.currentIndex = -1;
            extension.storage.searchText = '';
            extension.storage.pendingRequest = null;
            extension.editor?.view.dispatch(extension.editor.state.tr);
            EventBus.emit('search:clear');
            return;
          }
          
          extension.storage.searchText = text;
          console.log('搜索扩展 - 搜索文本:', text);
          console.log('搜索扩展 - 选项:', options);
          
          const requestId = Date.now();
          extension.storage.pendingRequest = requestId;
          const docJson = extension.editor?.getJSON();
          
          console.log('搜索扩展 - 编辑器实例:', extension.editor);
          console.log('搜索扩展 - 文档JSON:', docJson);
          console.log('搜索扩展 - 文档类型:', typeof docJson);
          console.log('搜索扩展 - 文档内容:', JSON.stringify(docJson, null, 2));
          
          if (!docJson) {
            console.warn('搜索扩展 - 文档为空，无法搜索');
            return;
          }
          
          // 检查文档是否有内容
          if (!docJson.content || !Array.isArray(docJson.content) || docJson.content.length === 0) {
            console.warn('搜索扩展 - 文档内容为空');
            return;
          }
          
          const message = {
            requestId,
            doc: docJson,
            text,
            options: {
              caseSensitive: options?.caseSensitive ?? extension.options.caseSensitive,
              wholeWord: options?.wholeWord ?? extension.options.wholeWord,
            } as SearchOptions,
          };
          
          console.log('搜索扩展 - 发送消息给Worker:', message);
          
          (worker as Worker | null)?.postMessage(message);
        },
        clearSearch: () => {
          console.log('搜索扩展 - 通过编辑器调用清除搜索');
          extension.storage.matches = [];
          extension.storage.currentIndex = -1;
          extension.storage.searchText = '';
          extension.storage.pendingRequest = null;
          extension.editor?.view.dispatch(extension.editor.state.tr);
          EventBus.emit('search:clear');
        },
        nextMatch: () => {
          console.log('搜索扩展 - 通过编辑器调用下一个匹配');
          const { matches, currentIndex } = extension.storage;
          if (!matches || matches.length === 0) return;
          const nextIndex = currentIndex + 1 >= matches.length ? 0 : currentIndex + 1;
          
          if (nextIndex < 0 || nextIndex >= matches.length) return;
          const { from, to } = matches[nextIndex];
          extension.storage.currentIndex = nextIndex;
          if (extension.editor) {
            const { state, view } = extension.editor;
            const tr = state.tr.setSelection(TextSelection.create(state.doc, from, to));
            view.dispatch(tr);
            view.focus();
            // 滚动到匹配位置
            const dom = view.nodeDOM(from) as HTMLElement;
            if (dom) {
              dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        },
        prevMatch: () => {
          console.log('搜索扩展 - 通过编辑器调用上一个匹配');
          const { matches, currentIndex } = extension.storage;
          if (!matches || matches.length === 0) return;
          const prevIndex = currentIndex - 1 < 0 ? matches.length - 1 : currentIndex - 1;
          
          if (prevIndex < 0 || prevIndex >= matches.length) return;
          const { from, to } = matches[prevIndex];
          extension.storage.currentIndex = prevIndex;
          if (extension.editor) {
            const { state, view } = extension.editor;
            const tr = state.tr.setSelection(TextSelection.create(state.doc, from, to));
            view.dispatch(tr);
            view.focus();
            // 滚动到匹配位置
            const dom = view.nodeDOM(from) as HTMLElement;
            if (dom) {
              dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        },
        getMatchCount: () => extension.storage.matches.length,
        getCurrentMatchIndex: () => extension.storage.currentIndex,
        getSearchText: () => extension.storage.searchText,
        hasMatches: () => extension.storage.matches.length > 0,
      };
    } else {
      console.warn('搜索扩展 - 编辑器实例不存在，无法暴露方法');
    }
  },
  
  onDestroy() {
    (worker as Worker | null)?.terminate();
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state: any) => {
            const { matches, currentIndex } = this.storage;
            if (!matches || matches.length === 0) return null;
            
            const decorations = matches.map((match: Match, index: number) => {
              const className = index === currentIndex 
                ? `${this.options.highlightClass} ${this.options.currentHighlightClass}`
                : this.options.highlightClass;
              return Decoration.inline(match.from, match.to, { class: className });
            });
            
            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },

  // 实际的搜索方法
  performSearch(text: string, options?: Partial<SearchOptions>) {
    if (!text) {
      this.performClearSearch();
      return;
    }
    
    this.storage.searchText = text;
    console.log('搜索扩展 - 搜索文本:', text);
    console.log('搜索扩展 - 选项:', options);
    
    const requestId = Date.now();
    this.storage.pendingRequest = requestId;
    const docJson = this.editor?.getJSON();
    
    console.log('搜索扩展 - 编辑器实例:', this.editor);
    console.log('搜索扩展 - 文档JSON:', docJson);
    console.log('搜索扩展 - 文档类型:', typeof docJson);
    console.log('搜索扩展 - 文档内容:', JSON.stringify(docJson, null, 2));
    
    if (!docJson) {
      console.warn('搜索扩展 - 文档为空，无法搜索');
      return;
    }
    
    // 检查文档是否有内容
    if (!docJson.content || !Array.isArray(docJson.content) || docJson.content.length === 0) {
      console.warn('搜索扩展 - 文档内容为空');
      return;
    }
    
    const message = {
      requestId,
      doc: docJson,
      text,
      options: {
        caseSensitive: options?.caseSensitive ?? this.options.caseSensitive,
        wholeWord: options?.wholeWord ?? this.options.wholeWord,
      } as SearchOptions,
    };
    
    console.log('搜索扩展 - 发送消息给Worker:', message);
    
    (worker as Worker | null)?.postMessage(message);
  },

  performClearSearch() {
    this.storage.matches = [];
    this.storage.currentIndex = -1;
    this.storage.searchText = '';
    this.storage.pendingRequest = null;
    this.editor?.view.dispatch(this.editor.state.tr);
    EventBus.emit('search:clear');
  },

  performNextMatch() {
    const { matches, currentIndex } = this.storage;
    if (!matches || matches.length === 0) return;
    const nextIndex = currentIndex + 1 >= matches.length ? 0 : currentIndex + 1;
    this.navigateToMatch(nextIndex);
  },

  performPrevMatch() {
    const { matches, currentIndex } = this.storage;
    if (!matches || matches.length === 0) return;
    const prevIndex = currentIndex - 1 < 0 ? matches.length - 1 : currentIndex - 1;
    this.navigateToMatch(prevIndex);
  },

  navigateToMatch(index: number) {
    const { matches } = this.storage;
    if (index < 0 || index >= matches.length) return;
    const { from, to } = matches[index];
    this.storage.currentIndex = index;
    if (this.editor) {
      const { state, view } = this.editor;
      const tr = state.tr.setSelection(TextSelection.create(state.doc, from, to));
      view.dispatch(tr);
      view.focus();
      // 滚动到匹配位置
      const dom = view.nodeDOM(from) as HTMLElement;
      if (dom) {
        dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  },

  getMatchCount(): number {
    return this.storage.matches.length;
  },

  getCurrentMatchIndex(): number {
    return this.storage.currentIndex;
  },

  getSearchText(): string {
    return this.storage.searchText;
  },

  hasMatches(): boolean {
    return this.storage.matches.length > 0;
  },
});