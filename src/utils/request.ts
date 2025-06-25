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
    const token = localStorage.getItem('token')
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
    const res = response.data

    // code 为 200 表示业务成功
    if (res.code === 200) {
      return res.data
    } else {
      // 业务失败，显示错误信息
      ElMessage.error(res.message || '业务错误')
      return Promise.reject(res)
    }
  },
  (error) => {
    ElMessage.error('请求失败，请检查网络或稍后重试')
    return Promise.reject(error)
  }
)

export default instance
