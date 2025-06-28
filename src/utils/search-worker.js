console.log('WORKER LOADED');

// 接收主线程消息
self.onmessage = (e) => {
  const { requestId, doc, text, options = {} } = e.data;
  console.log('worker received:', requestId, doc, text, options);

  const matches = searchInDoc(doc, text, options);
  console.log('主线程收到 worker 匹配结果:', matches);

  self.postMessage({ requestId, matches });
};

// 修正：全局位置累加，确保from/to为文档全局坐标
function searchInDoc(doc, searchText, { caseSensitive = false, wholeWord = false } = {}) {
  if (!searchText || !doc) {
    console.log('Invalid input:', { searchText, doc });
    return [];
  }
  
  console.log('Starting search with:', { searchText, caseSensitive, wholeWord });
  
  const normalizedSearch = caseSensitive ? searchText : searchText.toLowerCase();
  const matches = [];
  let globalPos = 0;

  function traverse(node) {
    console.log('traverse:', node.type, node.text || '', node.content ? node.content.length : 0);
    if (node.type === 'text') {
      const nodeText = node.text || '';
      if (!nodeText) return globalPos;
      
      console.log('Processing text node:', { text: nodeText, globalPos });
      
      const normalizedText = caseSensitive ? nodeText : nodeText.toLowerCase();
      let startIndex = 0;

      while (startIndex < normalizedText.length) {
        const matchIndex = normalizedText.indexOf(normalizedSearch, startIndex);
        if (matchIndex === -1) break;

        console.log('Found match at index:', matchIndex, 'in text:', nodeText.substring(matchIndex, matchIndex + searchText.length));

        // 全词匹配校验
        if (wholeWord) {
          const isWordStart = matchIndex === 0 || /\b/.test(normalizedText[matchIndex - 1]);
          const isWordEnd = matchIndex + normalizedSearch.length === normalizedText.length || 
                            /\b/.test(normalizedText[matchIndex + normalizedSearch.length]);
          if (!isWordStart || !isWordEnd) {
            console.log('Word boundary check failed');
            startIndex = matchIndex + 1;
            continue;
          }
        }

        // 计算全局位置
        const from = globalPos + matchIndex;
        const to = from + searchText.length;
        
        console.log('Calculated position:', { from, to, searchText });
        
        // 避免重复匹配
        const isDuplicate = matches.some(match => 
          match.from === from && match.to === to
        );
        
        if (!isDuplicate) {
          matches.push({ from, to });
          console.log('Added match:', { from, to });
        }

        startIndex = matchIndex + 1;
      }
      globalPos += nodeText.length;
      return globalPos;
    } else if (Array.isArray(node.content)) {
      console.log('Processing content array with', node.content.length, 'children');
      for (const child of node.content) {
        traverse(child);
      }
    } else {
      console.log('No content array found in node:', node.type);
    }
  }

  // 从文档根节点开始遍历
  try {
    console.log('Starting document traversal');
    console.log('Document root:', doc);
    traverse(doc);
  } catch (error) {
    console.error('Error traversing document:', error);
    return [];
  }
  
  console.log('Raw matches before deduplication:', matches);
  
  // 按位置排序并去重
  const uniqueMatches = matches
    .sort((a, b) => a.from - b.from)
    .filter((match, index, array) => {
      if (index === 0) return true;
      const prev = array[index - 1];
      return !(match.from === prev.from && match.to === prev.to);
    });
    
  console.log('Final unique matches:', uniqueMatches);
  return uniqueMatches;
}

// 辅助函数：检查是否为单词边界
function isWordBoundary(char) {
  return !char || /[\s\W]/.test(char);
}

// Worker 中添加错误处理
self.onerror = (e) => {
  console.error('Worker error:', e);
  self.postMessage({ 
    error: `Worker error: ${e.message}`,
    matches: []
  });
};

// 处理未捕获的异常
self.onunhandledrejection = (e) => {
  console.error('Unhandled promise rejection in worker:', e);
  self.postMessage({ 
    error: `Unhandled promise rejection: ${e.reason}`,
    matches: []
  });
};