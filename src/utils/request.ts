import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://127.0.0.1:3300', 
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
    return Promise.reject(error)
  }
)

// 响应拦截
instance.interceptors.response.use(
  (response) => {
    return response.data 
  },
  (error) => {
    if (error.response?.status === 401) {
      alert('登录已过期，请重新登录')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance