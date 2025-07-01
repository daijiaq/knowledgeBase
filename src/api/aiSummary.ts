// import request from "../utils/request";

// 非流式输出
// interface SummaryResponse {
//   code: number;
//   message: string;
//   data: {
//     summary: string;
//   };
// }
// export const generateSummary = (
//   documentText: string
// ): Promise<SummaryResponse> => {
//   return request({
//     url: "/folders/summary",
//     method: "POST",
//     data: { documentText },
//     timeout: 15000,
//   });

// interface SummaryChunk {
//   content: string;
//   isLast: boolean;
//   error?: string;
//   message?: string;
// }

// !!!生成文档摘要（流式输出版本）SSE 无法传token
// export const generateSummary = (documentText: string): string => {
//   // 返回SSE连接URL
//   return `http://localhost:3300/api/folders/summary?documentText=${encodeURIComponent(documentText)}`;
// };

// !!!使用fetch处理SSE流式输出
export const generateSummary = (
  documentText: string,
  onData: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => {
  const userToken = sessionStorage.getItem("token");
  let abortController = new AbortController();

  const fetchSSE = async () => {
    try {
      // 使用fetch发送请求，可以添加自定义请求头
      const response = await fetch(
        `http://localhost:3300/api/folders/summary?documentText=${encodeURIComponent(
          documentText
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "text/event-stream",
            "Cache-Control": "no-cache",
            ...(userToken && { Authorization: `Bearer ${userToken}` }), // 添加token到请求头
          },
          signal: abortController.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("响应体为空");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // 处理流式响应
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // 解码数据块
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // 按行分割处理SSE数据
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // 保留最后一个不完整的行

        for (const line of lines) {
          const trimmedLine = line.trim();

          // 处理SSE数据行
          if (trimmedLine.startsWith("data: ")) {
            const content = trimmedLine.slice(6); // 去掉 "data: " 前缀

            if (content) {
              onData(content);
            }
          }
          // 处理结束事件
          else if (trimmedLine.startsWith("event: close")) {
            onComplete();
            return;
          }
          // 忽略心跳和其他行
        }
      }

      // 如果循环正常结束，也调用完成回调
      onComplete();
    } catch (error: any) {
      console.error("fetch SSE请求失败:", error);

      if (error.name === "AbortError") {
        console.log("请求被取消");
        return;
      }

      onError(error);
    }
  };

  // 启动请求
  fetchSSE();

  // 返回取消函数
  return () => {
    abortController.abort();
  };
};
