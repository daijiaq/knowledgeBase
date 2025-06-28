// summary.ts
import request from "../utils/request";

interface SummaryResponse {
  code: number;
  message: string;
  data: {
    summary: string;
  };
}

// 生成文档摘要
export const generateSummary = (
  documentText: string
): Promise<SummaryResponse> => {
  return request({
    url: "/folders/summary",
    method: "POST",
    data: { documentText },
    timeout: 15000,
  });
};
