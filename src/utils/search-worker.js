// 接收主线程消息
self.onmessage = (e) => {
    const { requestId, doc, text, options } = e.data;
    const matches = searchInDoc(doc, text, options);
    self.postMessage({ requestId, matches }); // 返回结果
  };
  
// 核心搜索函数（遍历文档并匹配文本）
function searchInDoc(doc, searchText, { caseSensitive, wholeWord }) {
    const normalizedSearch = caseSensitive ? searchText : searchText.toLowerCase();
    const matches = [];

    // 递归遍历文档节点（Tiptap JSON 结构）
    function traverse(node, parentPos = 0) {
        if (node.type === 'text') {
        const nodeText = node.text || '';
        const normalizedText = caseSensitive ? nodeText : nodeText.toLowerCase();
        let startIndex = 0;

        while (startIndex <= normalizedText.length) {
            const matchIndex = normalizedText.indexOf(normalizedSearch, startIndex);
            if (matchIndex === -1) break;

            // 全词匹配校验
            if (wholeWord) {
            const isWordStart = matchIndex === 0 || /\b/.test(normalizedText[matchIndex - 1]);
            const isWordEnd = matchIndex + normalizedSearch.length === normalizedText.length || 
                                /\b/.test(normalizedText[matchIndex + normalizedSearch.length]);
            if (!isWordStart || !isWordEnd) {
                startIndex = matchIndex + 1;
                continue;
            }
            }

            // 计算文档中的绝对位置（关键！）
            const from = parentPos + matchIndex;
            const to = from + normalizedSearch.length;
            matches.push({ from, to });

            startIndex = matchIndex + 1;
        }
        return parentPos + (nodeText.length || 0);
        }

        // 非文本节点：递归处理子节点并累加位置
        let currentPos = parentPos;
        if (node.content) {
        for (const child of node.content) {
            currentPos = traverse(child, currentPos);
        }
        }
        return currentPos;
    }

    // 从文档根节点开始遍历（Tiptap JSON 的根是 { type: 'doc', content: [...] }）
    traverse(doc, 0);
    return matches;
}

// Worker 中添加错误处理
self.onerror = (e) => {
    self.postMessage({ error: `Worker error: ${e.message}` });
};