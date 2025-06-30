<template>
    <div v-if="editor" class="container">
        <div class="button-group">
          <button
            @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().chain().focus().undo().run()"
          >
            <span class="iconfont icon-25chehui"></span>
          </button>
          <button
            @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().chain().focus().redo().run()"
          >
            <span class="iconfont icon-26quxiaochehui"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
          >
            <span class="iconfont icon-bold"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
          >
            <span class="iconfont icon-italic"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }"
          >
            <span class="iconfont icon-strikethrough"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleCode().run()"
            :disabled="!editor.can().chain().focus().toggleCode().run()"
            :class="{ 'is-active': editor.isActive('code') }"
          >
            <span class="iconfont icon-code-view"></span>
          </button>
          <button
            @click="editor.chain().focus().setParagraph().run()"
            :class="{ 'is-active': editor.isActive('paragraph') }"
          >
            <span class="iconfont icon-duanla"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          >
            <span class="iconfont icon-13biaoti1"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          >
            <span class="iconfont icon-14biaoti2"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          >
            <span class="iconfont icon-15biaoti3"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
          >
            <span class="iconfont icon-16biaoti4"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
          >
            <span class="iconfont icon-17biaoti5"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
          >
            <span class="iconfont icon-18biaoti6"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }"
          >
            <span class="iconfont icon-list-unordered"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }"
          >
            <span class="iconfont icon-list-ordered"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleCodeBlock().run()"
            :class="{ 'is-active': editor.isActive('codeBlock') }"
          >
            <span class="iconfont icon-daimakuaicodeblock"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'is-active': editor.isActive('blockquote') }"
          >
            <span class="iconfont icon-double-quotes-l"></span>
          </button>
          <button @click="editor.chain().focus().setHorizontalRule().run()">
            <span class="iconfont icon-split-cells-vertical"></span>
          </button>
          <button @click="editor.chain().focus().setHardBreak().run()">
            <span class="iconfont icon-text-wrap"></span>
          </button>
          <button
            @click="editor.chain().focus().setTextAlign('left').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
          >
            <span class="iconfont icon-align-left"></span>
          </button>
          <button
            @click="editor.chain().focus().setTextAlign('center').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
          >
            <span class="iconfont icon-align-center"></span>
          </button>
          <button
            @click="editor.chain().focus().setTextAlign('right').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
          >
            <span class="iconfont icon-align-right"></span>
          </button>
          <button
            @click="editor.chain().focus().setTextAlign('justify').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
          >
            <span class="iconfont icon-align-justify"></span>
          </button>
          <button
            @click="setLink"
            :class="{ 'is-active': editor.isActive('link') }"
          >
            <span class="iconfont icon-link"></span>
          </button>
          <button
            @click="editor.chain().focus().unsetLink().run()"
            :disabled="!editor.isActive('link')"
          >
            <span class="iconfont icon-link-unlink"></span>
          </button>
          <button
            @click="editor.chain().focus().toggleUnderline().run()"
            :class="{ 'is-active': editor.isActive('underline') }"
          >
            <span class="iconfont icon-font-color"></span>
          </button>
          <el-dropdown placement="top-end" size="small">
            <button>
              <span class="iconfont icon-24zitiyanse"></span>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <button
                    @click="editor.chain().focus().unsetColor().run()"
                    class="color-picker"
                    :style="{ backgroundColor: '#2D2D2D' }"
                  ></button>
                </el-dropdown-item>
                <el-dropdown-item v-for="color in fontColors" :key="color">
                  <button
                    @click="editor.chain().focus().setColor(color).run()"
                    class="color-picker"
                    :style="{ backgroundColor: color }"
                  ></button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown placement="top-end" size="small">
            <button>
              <span class="iconfont icon-19beijingyanse"></span>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="color in highlightColors" :key="color">
                  <button
                    :style="{ backgroundColor: color }"
                    @click="editor.chain().focus().setHighlight({ color }).run()"
                    class="color-picker"
                  ></button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <button
                    :style="{ backgroundColor: '#ffffff' }"
                    @click="editor.chain().focus().unsetHighlight().run()"
                    class="color-picker"
                  ></button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown placement="top-end" size="small">
            <button>
              <el-icon size="18" style="padding-top: 6px"><ChatSquare /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="addComment"> 添加评论 </el-dropdown-item>
                <el-dropdown-item @click="removeComment">
                  取消延续
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
          <!-- 搜索按钮 -->
          <button
            @click="openSearchPanel"
            :class="{ 'is-active': showSearchPanel }"
          >
          <el-icon size="16" style="padding-top: 6px"><ZoomIn /></el-icon>
          </button>
          
          <el-dropdown placement="top-end" size="small">
            <button>
              <el-icon size="18" style="padding-top: 6px"><MoreFilled /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="exportPdf">导出为pdf</el-dropdown-item>
                <el-dropdown-item @click="uploadDocx">导入docx
                  <input
                  type="file"
                  @change="handleWordUpload"
                  ref="uploadFile"
                  style="display: none"
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- 搜索面板 -->
          <SearchPanel 
            :visible="showSearchPanel"
            :editor="editor"
            @close="closeSearchPanel"
          />
        </div>
    </div>
</template>

<script setup lang="ts">
/* import { ListItem } from "@tiptap/extension-list-item";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Comment } from "../utils/comment-extension";
import { Search } from "../utils/search-extension"; */
import { Editor as EditorType } from "@tiptap/vue-3";
import { onBeforeUnmount, ref, computed, onMounted } from "vue";
import type { ComputedRef } from "vue";
import { nanoid } from "nanoid";
import { ChatSquare, MoreFilled,ZoomIn } from "@element-plus/icons-vue";
import EventBus from "../utils/event-bus";
import { generatePDF } from "../utils/export-pdf";
import { debounce } from "../utils/debounce";
import * as mammoth from "mammoth";
import { ElMessage } from "element-plus";
import SearchPanel from "./SearchPanel.vue";

// Props 类型声明
interface EditorProps {
  externalEditor?: EditorType | null;
}

// 创建立即执行的防抖函数（等待 5s）
//防止文件过大产生的延迟
const debouncedSubmit = debounce(generatePDF, 5000, true);

const props = defineProps<EditorProps>();

// 颜色列表
const highlightColors = ref<string[]>([
  "#E0F7FA",
  "#FFF3E0",
  "#FFF8E1",
  "#F0F4C3",
  "#FFE0B2",
  "#EDE7F6",
]);
const fontColors = ref<string[]>([
  "#A8D8EA",
  "#D8BFD8",
  "#8B7E74",
  "#958DF1",
  "#9CA3AF",
]);

const uploadFile = ref<HTMLInputElement | null>(null);

// 搜索相关状态
const showSearchPanel = ref<boolean>(false)

let selectedRange: { from: number; to: number } | null = null;

/* const internalEditor = useEditor({
  extensions: [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Link.configure({ openOnClick: false, defaultProtocol: "https" }),
    StarterKit,
    Underline,
    Comment,
    Search.configure({
      highlightClass: "search-highlight",
      currentHighlightClass: "search-highlight-current",
      caseSensitive: false,
      wholeWord: false,
      regex: false,
    }),
  ],
  content: ``,
}); */

// 计算属性决定使用哪个编辑器实例
const editor: ComputedRef<EditorType | null> = computed(() => {
  return props.externalEditor ?? null;
});


// 建立链接
const setLink = () => {
  const previousUrl = editor.value?.getAttributes("link").href;
  const url = window.prompt("URL", previousUrl);

  if (url === null) return;
  if (url === "") {
    editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }
  editor.value
    ?.chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: url })
    .run();
};

// 搜索相关方法
// 打开搜索面板
const openSearchPanel = () => {
  showSearchPanel.value = true
}
// 关闭搜索面板
const closeSearchPanel = () => {
  showSearchPanel.value = false
}

// 键盘快捷键处理
const handleKeydown = (event: KeyboardEvent) => {
  // 搜索快捷键
  if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault()
      openSearchPanel()
  }
}

// 监听键盘事件
onMounted(() => {
  window.addEventListener("keydown", handleKeydown)
})

// 导出pdf
const exportPdf = () => {
  debouncedSubmit({
    element: document.querySelector(".tiptap") as HTMLElement,
    filename: "xxx.pdf",
  });
};

//上传docx文档
const handleWordUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  if (
    !file.type.includes("wordprocessingml.document") &&
    !file.name.endsWith(".docx")
  ) {
    ElMessage.error("仅支持上传 .docx 格式的 Word 文档");
    return;
  }
  try {
    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const htmlContent = result.value;
    const errors = result.messages;
    editor.value?.commands.setContent(htmlContent);
    if (errors.length > 0) {
      console.warn("转换警告:", errors);
    }
  } catch (error) {
    console.error("转换失败:", error);
    ElMessage.error("文件转换失败，请检查文件是否为有效 .docx 格式");
  }
};

// 模拟点击
const uploadDocx = () => {
  uploadFile.value?.click();
};

let text_id: string | null = null;

// 添加评论按钮点击事件
const addComment = () => {
  const { from, to } = editor.value!.state.selection;
  if (from === to) {
    // @ts-ignore
    ElMessage.info("未选中文本！");
    return;
  }
  const markInfo: Array<{
    text: string;
    marks: Array<{ name: string; attrs: any }>;
  }> = [];
  editor.value!.state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.isText) {
      const nodeStart = pos;
      const nodeEnd = pos + node.nodeSize;
      const textStart = Math.max(from, nodeStart);
      const textEnd = Math.min(to, nodeEnd);
      const offsetInNode = textStart - nodeStart;
      const lengthInNode = textEnd - textStart;
      const selectedText =
        node.text?.slice(offsetInNode, offsetInNode + lengthInNode) || "";
      const marks = node.marks;
      if (marks.length > 0) {
        markInfo.push({
          text: selectedText,
          marks: marks.map((mark) => ({
            name: mark.type.name,
            attrs: mark.attrs,
          })),
        });
      }
    }
  });

  console.log(markInfo);
  
  if (markInfo.length === 1 && markInfo[0]?.text.length === to - from) {
    markInfo[0].marks.forEach((mark) => {
      if (mark.name === "comment") {
        text_id = mark.attrs.id;
      }
    });
  }

  selectedRange = { from, to };
  EventBus.emit("showCommentInput", true);
};

// 确认评论（保存到编辑器）
const confirmComment = () => {
  const attributes = {
    id: text_id || nanoid(),
  };
  editor.value?.chain().focus().setMark("comment", attributes).run();
  //保存评论接口
  selectedRange = null;
};

EventBus.on("confirmComment", (val) => {
  if (val as boolean) {
    confirmComment();
  } else {
    selectedRange = null;
  }
});

// 删除当前选中范围的评论
const removeComment = () => {
  const { from, to } = editor.value!.state.selection;
  if (from === to) {
    editor.value?.chain().focus().unsetMark("comment").run();
  } else {
    ElMessage.info("请在评论区中选择自己所写评论删除噢~");
  }
};

onBeforeUnmount(() => {
  editor.value?.destroy();
  EventBus.all.clear();
  window.removeEventListener("keydown", handleKeydown)
});


</script>

<style lang="scss">
:deep(.el-tooltip__trigger:focus-visible) {
  outline: none;
}
.container {
  width: 80%;
  margin: 0 auto;
  // height: 80%;
  height: auto;

  .color-picker {
    width: 10px;
    height: 10px;
    :hover {
      border: none;
    }
  }
}
.button-group {
  button {
    /* 默认样式（未激活时） */
    margin: 1px;
    padding: 4px;
    color: #333;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    background-color: #ffffff;
    overflow: hidden;
    /* 激活时样式（is-active 类生效） */
    &.is-active {
      background: #958df1; /* 示例：紫色背景（与代码中紫色按钮色值一致） */
      color: white; /* 文字反色 */
      border-color: #7a72e0; /* 边框加深 */
      box-shadow: 0 2px 4px rgba(149, 141, 241, 0.2); /* 阴影增强层次感 */
    }

    /* 可选：悬停/焦点状态（非激活时） */
    &:not(.is-active):hover {
      background: #e0e0e0;
    }
  }
  text-align: center;
  position: relative;
}
/* Basic editor styles */
.tiptap {
  outline: none;
  h1{
    font-size: 30px;
  }
  hr{
    margin: 15px 0;
  }
  li{
    margin-left: 20px;
  }
  code {
    font-family: "Consolas", monospace; /* 等宽字体 */
    background-color: #e0e0e0;
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }
  pre {
    background: #000000;
    border-radius: 0.5rem;
    color: #ffffff;
    font-family: "JetBrainsMono", monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      font-family: "Consolas", monospace; /* 等宽字体 */
      background-color: #e0e0e0;
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }
  blockquote {
    border-left: 3px solid #e0e0e0;
    color: #595959;
    margin: 1.5rem 0;
    padding-left: 1rem;
  }
  a {
    color: #958df1;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      color: #8a82e8;
    }
  }
  .tiptap-comment {
    text-decoration: underline;
    text-decoration-color: #2196f3;
    cursor: pointer;
  }
  .search-highlight {
    background-color: #fffbcd; /* 黄色背景 */
    border-radius: 2px;
    padding: 0 2px;
  }
}

.editor-content {
  // margin-top: 20px;
  height: 200px;
  padding: 5px;
}

/* 搜索高亮样式 */
.search-highlight {
  background-color: #fffbcd;
  border-radius: 2px;
  padding: 0 2px;
}

.search-highlight-current {
  background-color: #ffd700 !important;
  border: 1px solid #ffb300;
  border-radius: 2px;
  padding: 0 2px;
}
</style>
