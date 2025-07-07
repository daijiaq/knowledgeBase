/**
 * 防抖函数
 * @param func 需要防抖的目标函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否在第一次触发时立即执行（默认 false）
 * @returns 包装后的防抖函数，包含 `cancel` 方法用于手动取消未执行的定时器
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number = 300,
    immediate: boolean = false
  ): {
    (...args: Parameters<T>): void;
    cancel: () => void;
  } {
    let timeout: ReturnType<typeof setTimeout> | null = null;
  
    // 定义包装函数，使用泛型捕获参数类型和返回值类型
    const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      const context = this; // 保存函数调用上下文（this 指向）
      const callNow = immediate && !timeout; // 是否需要立即执行（仅首次触发且未设置定时器时）
  
      // 清除之前的定时器
      if (timeout) clearTimeout(timeout);
  
      // 设置新的定时器
      timeout = setTimeout(() => {
        timeout = null; // 等待期结束后，允许下次立即执行（若 immediate 为 true）
        if (!immediate) {
          func.apply(context, args); // 非立即执行版：等待期结束后执行
        }
      }, wait);
  
      // 立即执行版：首次触发时执行
      if (callNow) {
        func.apply(context, args);
      }
    };
  
    // 添加 cancel 方法，用于手动取消未执行的定时器
    debounced.cancel = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
  
    return debounced;
  }