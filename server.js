import { WebSocketServer } from "ws";
import * as Y from "yjs";

const server = new WebSocketServer({ port: 1234 });

// console.log("Y.js WebSocket 服务器已启动，端口: 1234");

// 存储文档实例
const docs = new Map();

// 获取或创建文档
function getYDoc(docname) {
  let doc = docs.get(docname);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(docname, doc);
  }
  return doc;
}

server.on("connection", (ws, req) => {
  console.log("新的客户端连接");

  // 解析房间名称
  const url = new URL(req.url, `http://${req.headers.host}`);
  const roomname = url.searchParams.get("room") || "default-room";

  // 获取或创建文档
  const doc = getYDoc(roomname);

  // 处理消息
  ws.on("message", (message) => {
    try {
      const data = new Uint8Array(message);

      // 应用更新到文档
      if (data[0] === 0) {
        // 同步步骤1
        const encoder = Y.encodeStateAsUpdate(doc);
        ws.send(encoder);
      } else if (data[0] === 1) {
        // 更新
        Y.applyUpdate(doc, data.slice(1));

        // 广播更新到其他客户端
        server.clients.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            // WebSocket.OPEN = 1
            client.send(message);
          }
        });
      } else if (data[0] === 2) {
        // 同步步骤2
        Y.applyUpdate(doc, data.slice(1));
      }
    } catch (error) {
      console.error("处理消息时出错:", error);
    }
  });

  // 发送初始状态
  const stateVector = Y.encodeStateVector(doc);
  const update = Y.encodeStateAsUpdate(doc, stateVector);
  if (update.length > 0) {
    ws.send(new Uint8Array([0, ...update]));
  }

  ws.on("close", () => {
    console.log("客户端断开连接");
  });

  ws.on("error", (error) => {
    console.error("WebSocket 连接错误:", error);
  });
});

server.on("error", (error) => {
  console.error("WebSocket 服务器错误:", error);
});

process.on("SIGINT", () => {
  console.log("正在关闭服务器...");
  server.close(() => {
    console.log("服务器已关闭");
    process.exit(0);
  });
});
