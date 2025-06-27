import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 将元素转化为canvas元素
// 通过 放大 提高清晰度
// width为内容宽度
async function toCanvas(element: HTMLElement) {
  if (!element) return { width: 0, height: 0 };

  // canvas元素
  const canvas = await html2canvas(element, {
    scale: window.devicePixelRatio * 2, // 增加清晰度
    useCORS: true // 允许跨域
  });

  // 获取canvas转化后的宽高
  const { width: canvasWidth, height: canvasHeight } = canvas;

  // 转化成图片Data
  const canvasData = canvas.toDataURL('image/jpeg', 1.0);

  return { width: canvasWidth, height: canvasHeight, data: canvasData };
}

/**
 * 生成pdf(A4多页pdf截断问题， 包括页眉、页脚 和 上下左右留空的护理)
 */
export async function generatePDF({
  /** pdf内容的dom元素 */
  element,
  /** pdf文件名 */
  filename
}: {
  element: HTMLElement;
  filename: string;
}) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  const pdf = new jsPDF();
  const padding = 10; // 页边距
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pdfWidth - padding * 2;
  const contentHeight = pdfHeight - padding * 2;

  // 生成canvas和图片
  const { width: imageWidth, height: imageHeight, data } = await toCanvas(element);

  // 计算缩放比例，保证内容宽度适应PDF
  const scale = contentWidth / imageWidth;
  const imgW = imageWidth * scale;
  const imgH = imageHeight * scale;

  // 计算总页数
  const pageCount = Math.ceil(imgH / contentHeight);

  for (let i = 0; i < pageCount; i++) {
    const sY = (contentHeight / scale) * i; // 源图片起始y坐标（像素）
    const sHeight = Math.min(imageHeight - sY, contentHeight / scale); // 源图片截取高度

    // 创建临时canvas用于每页裁剪
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = imageWidth;
    pageCanvas.height = sHeight;
    const ctx = pageCanvas.getContext('2d');
    const img = new window.Image();
    img.src = data!;
    await new Promise(resolve => {
      img.onload = resolve;
    });
    ctx?.drawImage(
      img,
      0, sY, imageWidth, sHeight, // 源图
      0, 0, imageWidth, sHeight  // 目标
    );
    const pageData = pageCanvas.toDataURL('image/jpeg', 1.0);

    // 添加到PDF
    pdf.addImage(
      pageData,
      'JPEG',
      padding,
      padding,
      imgW,
      sHeight * scale
    );
    if (i < pageCount - 1) {
      pdf.addPage();
    }
  }

  return pdf.save(filename);
}
