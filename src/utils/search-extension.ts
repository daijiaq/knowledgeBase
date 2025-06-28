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
}

export const Search = Extension.create({
  name: 'search',

  addOptions() {
    return {
      highlightClass: 'search-highlight',
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
      //@ts-ignore
      search: (text: string) => search(text), // 挂载到 storage
    };
  },
  // 添加键盘快捷方式（可选：如 Ctrl+F 触发搜索面板）
  addKeyboardShortcuts() {
    return {
      'Mod-F': () => {
        window.dispatchEvent(new CustomEvent('search:open')); // 触发自定义事件，打开搜索面板
        return true;
      },
    };
  },
  
  onCreate() {
    // Store the worker in a variable outside the extension instance
    (this as any)._worker = new Worker(new URL('./search-worker.js', import.meta.url), { type: 'module' });
    this.storage = {
      matches: [],
      currentIndex: -1,
      pendingRequest: null,
    };
  
    // console.log(this.editor)
    
    (this as any)._worker.onmessage = (e: MessageEvent<SearchWorkerMessage>) => {
      const { requestId, matches } = e.data;
      if (requestId !== this.storage.pendingRequest) return;
      this.storage.matches = matches;
      this.storage.currentIndex = -1;
      this.editor?.view.dispatch(this.editor.state.tr); // 触发视图更新
      // 如需通知外部，请用事件总线或回调，不要用 this.editor.emit
      // 例如：window.dispatchEvent(new CustomEvent('search:results', { detail: matches }));
      console.log(matches);
      EventBus.emit('search:result',{detail: matches})
    };
  },
  
  onDestroy() {
    (this as any)._worker?.terminate();
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state: any) => {
            const { matches } = this.storage;
            if (!matches || matches.length === 0) return null;
            return DecorationSet.create(state.doc, [
              ...matches.map((match: Match) =>
                Decoration.inline(match.from, match.to, { class: this.options.highlightClass })
              ),
            ]);
          },
        },
      }),
    ];
  },

  search(text: string) {
    if (!text) {
      this.storage.matches = [];
      this.editor?.view.dispatch(this.editor.state.tr);
      return;
    }
    console.log(text);
    const requestId = Date.now();
    this.storage.pendingRequest = requestId;
    const docJson = this.editor?.getJSON();
    console.log(docJson,this.editor);
    
    (this as any)._worker?.postMessage({
      requestId,
      doc: docJson,
      text,
      options: {
        caseSensitive: this.options.caseSensitive,
        wholeWord: this.options.wholeWord,
      } as SearchOptions,
    });
  },

  nextMatch() {
    const { matches, currentIndex } = this.storage;
    if (!matches || matches.length === 0) return;
    const nextIndex = currentIndex + 1 >= matches.length ? 0 : currentIndex + 1;
    this.navigateToMatch(nextIndex);
  },

  prevMatch() {
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
    }
  },
});