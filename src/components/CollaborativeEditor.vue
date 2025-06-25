<template>
  <div class="collaborative-editor">
    <!-- 协同编辑器标题
    <h2 class="editor-title">协同富文本编辑器</h2> -->

    <!-- 连接状态指示器 -->
    <div class="connection-status">
      <div class="status-indicator">
        <span class="status-dot" :class="{
            connected: connectionStatus === 'connected',
            connecting: connectionStatus === 'connecting',
            disconnected: connectionStatus === 'disconnected',
          }"></span>
        <span class="status-text">
          {{ getStatusText() }}
        </span>
      </div>

      <!-- 在线用户数量 -->
      <div class="online-users">
        <span>在线用户: {{ onlineUsers }}</span>
      </div>
    </div>

    <!-- 协同编辑工具栏 -->
    <!-- <div class="toolbar" v-if="editor"> -->
    <!-- 基础格式化按钮 
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
          class="toolbar-btn"
          title="粗体"
        >
          <strong>B</strong>
        </button>

        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
          class="toolbar-btn"
          title="斜体"
        >
          <em>I</em>
        </button>

        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
          class="toolbar-btn"
          title="删除线"
        >
          <s>S</s>
        </button>
      </div>

      标题级别按钮 
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          class="toolbar-btn"
          title="一级标题"
        >
          H1
        </button>

        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          class="toolbar-btn"
          title="二级标题"
        >
          H2
        </button>

        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          class="toolbar-btn"
          title="三级标题"
        >
          H3
        </button>
      </div>

       列表按钮 
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          class="toolbar-btn"
          title="无序列表"
        >
          •
        </button>

        <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          class="toolbar-btn"
          title="有序列表"
        >
          1.
        </button>
      </div>

      其他功能按钮 
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          class="toolbar-btn"
          title="引用"
        >
          "
        </button>

        <button
          @click="editor.chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }"
          class="toolbar-btn"
          title="行内代码"
        >
          &lt;/&gt;
        </button>

        <button
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          class="toolbar-btn"
          title="代码块"
        >
          { }
        </button>
      </div>

       协同功能按钮 
      <div class="toolbar-group">
        <button
          @click="reconnectWebSocket"
          :disabled="connectionStatus === 'connecting'"
          class="toolbar-btn"
          title="重新连接"
        >
          🔄
        </button>

        <button
          @click="changeUserColor"
          class="toolbar-btn"
          title="更换光标颜色"
        >
          🎨
        </button>
      </div>
         </div>-->

    <!-- 使用 Editor 组件，传入协同编辑器实例，不显示其内容区域 -->
    <Editor :external-editor="editor" :show-editor-content="false" />

    <!-- 编辑器容器 -->
    <div class="editor-container">
      <editor-content :editor="editor" class="editor-content" @click="getComment"/>
    </div>

    <!-- 协同信息面板 -->
    <!-- <div class="collaboration-info">
      <div class="info-section">
        <h4>协同状态</h4>
        <p>房间ID: {{ props.roomId }}</p>
        <p>用户ID: {{ userId }}</p>
        <p>
          光标颜色:
          <span class="color-preview" :style="{ backgroundColor: userColor }"></span>
        </p>
      </div>

      <div class="info-section">
        <h4>使用说明</h4>
        <ul>
          <li>多个用户可以同时编辑同一文档</li>
          <li>实时看到其他用户的光标位置和编辑内容</li>
          <li>支持撤销/重做等协同操作</li>
          <li>自动保存和同步更改</li>
        </ul>
      </div>
    </div>-->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { ListItem } from "@tiptap/extension-list-item";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Comment } from '../utils/comment-extension'
import EventBus from '../utils/event-bus'

// 定义组件的 props
interface Props {
  /** WebSocket 服务器地址 */
  websocketUrl?: string;
  /** 协同文档房间ID */
  roomId?: string;
  /** 用户名称 */
  userName?: string;
}

// 定义连接状态类型
type ConnectionStatus = "connecting" | "connected" | "disconnected";

// 使用 defineProps
const props = withDefaults(defineProps<Props>(), {
  websocketUrl: "ws://localhost:1234",
  roomId: "collaborative-document",
  userName: "匿名用户",
});

// 响应式数据
const connectionStatus = ref<ConnectionStatus>("disconnected");
const onlineUsers = ref(0);
const userId = ref<string>("");
const userColor = ref<string>("");

// YJS 文档和提供者
let ydoc: Y.Doc | null = null;
let provider: WebsocketProvider | null = null;

/**
 * 生成随机用户ID
 */
const generateUserId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

/**
 * 生成随机颜色
 */
const generateRandomColor = (): string => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * 获取连接状态文本
 */
const getStatusText = (): string => {
  switch (connectionStatus.value) {
    case "connected":
      return "已连接";
    case "connecting":
      return "连接中...";
    case "disconnected":
      return "未连接";
    default:
      return "未知状态";
  }
};

/**
 * 初始化协同编辑基础设置
 */
const initializeCollaboration = () => {
  // 生成用户信息
  userId.value = generateUserId();
  userColor.value = generateRandomColor();

  // 创建 YJS 文档
  ydoc = new Y.Doc();

  // 创建 WebSocket 提供者
  provider = new WebsocketProvider(props.websocketUrl, props.roomId, ydoc);

  // 设置连接状态监听器
  provider.on("status", (event: { status: string }) => {
    console.log("WebSocket 状态变化:", event.status);
    switch (event.status) {
      case "connected":
        connectionStatus.value = "connected";
        break;
      case "connecting":
        connectionStatus.value = "connecting";
        break;
      case "disconnected":
        connectionStatus.value = "disconnected";
        break;
    }
  });

  // 监听用户连接状态变化
  provider.awareness.on("change", () => {
    onlineUsers.value = provider!.awareness.getStates().size;
  });

  // 设置当前用户信息
  provider.awareness.setLocalStateField("user", {
    name: props.userName,
    color: userColor.value,
  });

  return { ydoc, provider };
};

// 初始化协同编辑
const collaboration = initializeCollaboration();

// 使用 useEditor 创建编辑器实例
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      history: false,
    }),
    // 添加 Editor 组件所需的扩展
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    Highlight.configure({
      multicolor: true, // 启用多颜色
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Link.configure({
      openOnClick: false,
      defaultProtocol: "https",
    }),
    Underline,
    // 协同编辑扩展
    Collaboration.configure({
      document: collaboration.ydoc,
    }),
    CollaborationCursor.configure({
      provider: collaboration.provider,
      user: {
        name: props.userName,
        color: userColor.value,
      },
    }),
    Comment
  ],
  content: "",
  editorProps: {
    attributes: {
      class: "prose focus:outline-none",
      "data-placeholder": "开始协同编辑...",
    },
  },
  onUpdate({ editor, transaction }) {
    //自动获取数据内容
    const json = editor.getJSON();
    console.log(json);
    if (transaction.docChanged) {
      //文档变更细节
      console.log(transaction);
    }
  },
});

/**
 * 更换用户光标颜色
 */
const changeUserColor = () => {
  userColor.value = generateRandomColor();
  if (provider) {
    provider.awareness.setLocalStateField("user", {
      name: props.userName,
      color: userColor.value,
    });
  }
};

/**
 * 重新连接 WebSocket
 */
const reconnectWebSocket = () => {
  if (provider && connectionStatus.value !== "connecting") {
    connectionStatus.value = "connecting";
    provider.disconnect();
    setTimeout(() => {
      provider?.connect();
    }, 1000);
  }
};

/**
 * 销毁协同编辑器
 */
const destroyCollaboration = () => {
  if (provider) {
    provider.disconnect();
    provider.destroy();
    provider = null;
  }

  if (ydoc) {
    ydoc.destroy();
    ydoc = null;
  }
};

//获取评论
const getComment = (event:any) => {
  const { target } = event;
  if (!target.classList.contains("tiptap-comment")) return;
  // 获取被点击的 comment Mark 的属性
  const textId = target.getAttribute("id");
  EventBus.emit('getComment', {
    text_id: textId,
  })
};

// 生命周期钩子
onMounted(() => {
  console.log("协同编辑器已挂载");
});

onBeforeUnmount(() => {
  console.log("销毁协同编辑器...");
  destroyCollaboration();
});
</script>

<style scoped>
/* 协同编辑器容器样式 */
.collaborative-editor {
  display: flex;
  flex-direction: column;
  max-width: 890px;
  height: 100%;
  /* margin: 0 auto; */
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: white;
}


/* 连接状态指示器样式 */
.connection-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 16px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 状态点样式 */
.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.status-dot.connected {
  background-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.status-dot.connecting {
  background-color: #f59e0b;
  animation: pulse 2s infinite;
}

.status-dot.disconnected {
  background-color: #ef4444;
}

/* 脉冲动画 */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-text {
  font-weight: 500;
  color: #374151;
}

.online-users {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* 工具栏样式 */
/* .toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #f9fafb;
  margin-bottom: 16px;
}

.toolbar-group {
  display: flex;
  gap: 4px;
}

.toolbar-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 36px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.toolbar-btn.is-active {
  background-color: #3b82f6;
  color: white;
  border-color: #2563eb;
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f9fafb;
} */

/* 编辑器容器样式 */
.editor-container {
  flex: 1;
  /* border: 1px solid #d1d5db; */
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
  position: relative;
}

.editor-content {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
}

/* 编辑器内容样式 */
:deep(.ProseMirror) {
  padding: 16px;
  outline: none;
  font-size: 16px;
  line-height: 1.6;
  color: #374151;
}

/* 协作光标样式 */
:deep(.collaboration-cursor__caret) {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
  word-break: normal;
  pointer-events: none;
}

:deep(.collaboration-cursor__label) {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
}

/* 编辑器占位符样式 */
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
  height: 0;
  float: left;
}

/* 协同信息面板样式 */
/* .collaboration-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 16px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-top: 16px;
}

.info-section h4 {
  margin: 0 0 12px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.info-section p {
  margin: 6px 0;
  font-size: 14px;
  color: #6b7280;
}

.info-section ul {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  color: #6b7280;
}

.info-section li {
  margin: 4px 0;
}

.color-preview {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid #d1d5db;
  vertical-align: middle;
  margin-left: 4px;
} */

/* 响应式设计 */
@media (max-width: 768px) {
  .collaborative-editor {
    padding: 16px;
    margin: 10px;
  }

  .connection-status {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .toolbar {
    gap: 4px;
    padding: 8px;
  }

  .toolbar-btn {
    padding: 4px 8px;
    font-size: 12px;
    min-width: 32px;
    height: 28px;
  }

  .collaboration-info {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
