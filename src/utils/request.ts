import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:3300/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截
instance.interceptors.request.use(
  (config) => {
    let token = ''
    if (typeof window !== 'undefined') {
      token = sessionStorage.getItem('token') || ''
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    ElMessage.error('请求发送失败')
    return Promise.reject(error)
  }
)

// 响应拦截：统一处理 code
instance.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === 200) {
      return res;
    } else {
      ElMessage.error(res.message || '业务错误');
      return Promise.reject(res);
    }
  },
  (error) => {
    // 处理HTTP状态码非200的情况
    if (error.response) {
      const { status, data } = error.response;
      let message = '';

      switch (status) {
        case 400:
          message = '参数错误';
          break;
        case 401:
          message = '未授权，请重新登录';
          break;
        case 403:
          message = '拒绝访问，权限不足';
          break;
        case 404:
          message = '请求的资源不存在';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = `请求失败，状态码: ${status}`;
      }

      // 优先使用后端返回的错误信息
      ElMessage.error(data.message || message);

      return Promise.reject({
        code: status,
        message: data.message || message,
        data: data
      });
    } else if (error.request) {
      // 请求已发送，但没有收到响应
      ElMessage.error('请求超时，请稍后重试');
    } else {
      // 发送请求时出错
      ElMessage.error('请求失败，请检查网络连接');
    }

    return Promise.reject(error);
  }
);

// SSR 阶段动态注入 token
export function setSSRToken(token: string) {
  if (token) {
    instance.defaults.headers["Authorization"] = `Bearer ${token}`
  }
}

export default instance
