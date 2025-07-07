// SSR 注入的全局变量类型声明
declare global {
  interface Window {
    __INITIAL_STATE__?: any
  }
}
export {} 