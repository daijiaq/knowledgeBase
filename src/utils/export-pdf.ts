import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 将元素转化为canvas元素（带清晰度优化）
async function toCanvas(element: HTMLElement) {
  if (!element) return { width: 0, height: 0, data: '' };

  // 通过放大提高清晰度（2倍设备像素比）
  const canvas = await html2canvas(element, {
    scale: window.devicePixelRatio * 2,
    useCORS: true,          // 跨域图片支持
    backgroundColor: '#fff' // 背景色防透明
  });

  return {
    width: canvas.width,
    height: canvas.height,
    data: canvas.toDataURL('image/jpeg', 1.0) // 高质量JPG
  };
}

/**
 * 生成多页PDF（优化分页截断）
 * @param element 需要转换的DOM元素
 * @param filename PDF文件名
 */
export async function generatePDF({
  element,
  filename
}: {
  element: HTMLElement;
  filename: string;
}) {
  if (!(element instanceof HTMLElement)) return;

  // PDF基础配置（A4竖版，毫米单位）
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const padding = 10; // 页边距（毫米）
  const pageWidth = pdf.internal.pageSize.getWidth();  // A4宽度≈210mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // A4高度≈297mm
  const contentWidth = pageWidth - padding * 2;         // 内容可用宽度
  const contentHeight = pageHeight - padding * 2;       // 内容可用高度

  // 1. 生成原始内容Canvas
  const { width: canvasWidth, height: canvasHeight, data: imageData } = await toCanvas(element);
  if (!imageData) return;

  // 2. 计算内容缩放比例（确保宽度适配PDF）
  const scaleRatio = contentWidth / canvasWidth;

  // 3. 关键：计算分页点（避免元素跨页截断）
  const pages: number[] = [0]; // 分页起始坐标数组（基于原始Canvas高度）
  
  // 遍历元素节点计算分页点
  function traverseNodes(nodes: NodeListOf<ChildNode>) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i] as HTMLElement;
      if (!(node instanceof HTMLElement)) continue;

      // 获取元素在原始DOM中的位置和尺寸
      const rect = node.getBoundingClientRect();
      const elTop = rect.top + window.scrollY;    // 元素顶部绝对坐标
      const elHeight = rect.height;               // 元素高度
      
      // 转换为Canvas坐标系（基于原始Canvas尺寸）
      const canvasTop = (elTop / element.offsetWidth) * canvasWidth;
      const canvasElHeight = (elHeight / element.offsetWidth) * canvasWidth;

      // 计算当前元素在PDF中的显示位置
      const pdfTop = (canvasTop - pages[pages.length - 1]) * scaleRatio;
      
      // 核心逻辑：若元素超出当前页内容区域则新增分页
      if (pdfTop + canvasElHeight * scaleRatio > contentHeight) {
        pages.push(canvasTop); // 记录新分页起始点（原始Canvas坐标）
      }
    }
  }

  // 执行节点遍历计算分页点
  traverseNodes(element.childNodes);
  // 补充最后一页（若内容未完全覆盖）
  if (pages[pages.length - 1] + (contentHeight / scaleRatio) < canvasHeight) {
    pages.push(pages[pages.length - 1] + (contentHeight / scaleRatio));
  }

  // 4. 按分页点生成PDF
  for (let i = 0; i < pages.length; i++) {
    // 计算当前页截取区域（原始Canvas坐标）
    const startY = pages[i];
    const endY = Math.min(pages[i + 1] || canvasHeight, canvasHeight);
    const pageHeight = endY - startY;

    // 创建临时Canvas裁剪当前页内容
    const clipCanvas = document.createElement('canvas');
    clipCanvas.width = canvasWidth;
    clipCanvas.height = pageHeight;
    const ctx = clipCanvas.getContext('2d');
    
    const img = new Image();
    img.src = imageData;
    await new Promise(resolve => img.onload = resolve);
    
    ctx?.drawImage(
      img,
      0, startY,          // 原始Canvas截取起点
      canvasWidth, pageHeight, // 原始Canvas截取尺寸
      0, 0,               // 目标Canvas绘制起点
      canvasWidth, pageHeight  // 目标Canvas绘制尺寸
    );

    // 将裁剪后的内容添加到PDF
    pdf.addImage(
      clipCanvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      padding,          // PDF X坐标（页边距）
      padding,          // PDF Y坐标（页边距）
      contentWidth,     // PDF显示宽度（适配内容区）
      pageHeight * scaleRatio // PDF显示高度（按比例缩放）
    );

    // 非末页时新增页面
    if (i < pages.length - 1) pdf.addPage();
  }

  // 保存PDF
  return pdf.save(filename);
}