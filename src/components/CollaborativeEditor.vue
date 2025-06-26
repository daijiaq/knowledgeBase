<template>
  <div class="collaborative-editor">
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
    <!-- 使用 Editor 组件，传入协同编辑器实例，不显示其内容区域 -->
    <Editor :external-editor="editor" :show-editor-content="false" />

    <!-- 编辑器容器 -->
    <div class="editor-container">
      <editor-content :editor="editor" class="editor-content" @click="getComment" />
    </div>

    <!-- 协同信息面板 -->
    <div class="collaboration-info">
      <div class="info-section">
        <!-- <h4>协同状态</h4>
        <p>房间ID: {{ props.roomId }}</p>
        <p>用户ID: {{ userId }}</p> -->
        <p>
          光标颜色:
          <span class="color-preview" :style="{ backgroundColor: userColor }"></span>
        </p>
        <div class="editor-tool">
          <span class="update-time">更新于2025-6-25 13:45<span style="color:#7a72e0;cursor: pointer;">&nbsp;回退版本</span></span>
          <div class="button-box">
            <el-button type="success" color="#7a72e0" @click="aiClick = true">AI总结全文</el-button>
            <el-button type="success" color="#7a72e0">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-aside width="300px" v-if="aiClick">
    <div class="aiContent">
      <el-icon class="aiClose" color="#7a72e0" @click="aiClick = false">
        <Close />
      </el-icon>
      <p class="aiTitle">AI总结:</p>
      <p>财来财来财来财来财来财来财来财来财来财来财来财来财来财</p>
    </div>
  </el-aside>
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
import { Comment } from "../utils/comment-extension";
import EventBus from "../utils/event-bus";
import { Close } from "@element-plus/icons-vue";

let aiClick = ref(false);

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
  // websocketUrl: "ws://192.168.31.119:1234",
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
    onlineUsers.value = provider?.awareness.getStates().size ?? 0;
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
    Comment,
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
  try {
    // 清理awareness状态
    if (provider && provider.awareness) {
      provider.awareness.setLocalState(null);
      provider.awareness.off("change", () => {});
    }

    // 断开并销毁provider
    if (provider) {
      console.log("断开WebSocket连接");
      provider.disconnect();
      provider.destroy();
      provider = null;
    }

    // 销毁文档
    if (ydoc) {
      ydoc.destroy();
      ydoc = null;
    }

    // 重置状态
    connectionStatus.value = "disconnected";
    onlineUsers.value = 0;

    console.log("协同编辑器已完全销毁");
  } catch (error) {
    console.error("销毁协同编辑器时出错:", error);
  }
};

//获取评论
const getComment = (event: any) => {
  const { target } = event;
  if (!target.classList.contains("tiptap-comment")) return;
  // 获取被点击的 comment Mark 的属性
  const textId = target.getAttribute("id");
  EventBus.emit("getComment", {
    text_id: textId,
  });
};

// 页面卸载时清理连接
const handleBeforeUnload = () => {
  console.log("页面即将卸载，清理协同编辑连接");
  destroyCollaboration();
};

// 生命周期钩子
onMounted(() => {
  console.log("协同编辑器已挂载");

  // 监听页面卸载事件
  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("unload", handleBeforeUnload);
});

onBeforeUnmount(() => {
  console.log("销毁协同编辑器...");

  // 移除事件监听器
  window.removeEventListener("beforeunload", handleBeforeUnload);
  window.removeEventListener("unload", handleBeforeUnload);

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
  height: 400px;
  min-height: 200px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-content {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
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
  /* background-color: #f8fafc; 
  /* border: 1px solid #e2e8f0; 
  border-radius: 6px;
  margin-top: 16px;
} */

.info-section {
  display: flex;
  flex-direction: column;
  align-items: end;
}

/*
.info-section h4 {
  margin: 0 0 12px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}
*/

.info-section p {
  margin: 6px 0;
  font-size: 14px;
  color: #6b7280;
  text-align: end;
}

.button-box {
  float: right;
}
.info-section .button-box button {
  margin-top: 12px;
  color: #fff;
  float: right;
  margin-left: 5px;
}

.info-section .editor-tool{
  width: 100%;
}
.info-section .editor-tool .update-time{
  line-height: 58px;
  color: gray;
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
}

.aiContent {
  font-size: 16px;
  line-height: normal;
  padding: 16px 16px;
  text-wrap: wrap;
  background-color: white;
  border-radius: 6px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 100%;
}

.aiClose {
  align-self: flex-end;
  color: #7a72e0;
  cursor: pointer;
  font-weight: bold;
}

.aiTitle {
  color: #7a72e0;
  font-size: 18px;
}

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
