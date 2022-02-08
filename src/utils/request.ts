import axios, { AxiosRequestConfig } from 'axios'
import store from '@/store'
import router from '@/router'

const request = axios.create({
  // baseURL: import.meta.env.VITE_API_BASEURL
  baseURL: 'http://localhost:8080'
})

/* —————————————————————————————————— 请求拦截 —————————————————————————————————— */
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user && user.token) {
    config.headers!.Authorization = `Bearer ${user.token}`
  }
  // 设定 loding 状态
  if (config.url?.includes('/conditions')) {
    store.commit('setLoading', true)
  }

  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

/* —————————————————————————————————— 响应拦截 —————————————————————————————————— */
// token 刷新锁
let isRefreshing = false
request.interceptors.response.use(function (response) {
  // 复原 loding 状态
  if (response.config.url?.includes('/conditions')) {
    store.commit('setLoading', false)
  }

  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // 服务离线
  if (!error.response) {
    ElMessageBox.alert('服务不可用，请联系管理员', 'HTTP 503 错误')
  }

  // 复原 loding 状态
  if (error.response.config.url.includes('/conditions')) {
    store.commit('setLoading', false)
  }

  // token 过期/无效
  if (error.response.status === 401) {
    if (isRefreshing) return
    isRefreshing = true
    ElMessageBox.confirm(
      '您的登录状态已过期，请重新登录。',
      '登录过期',
      {
        confirmButtonText: '登录',
        cancelButtonText: '取消'
      }
    ).then(() => {
      store.commit('setUser', null)
      router.push({
        name: 'login',
        query: { redirect: router.currentRoute.value.fullPath }
      })
    }).finally(() => {
      isRefreshing = false
    })
  } else {
    ElMessage.error('操作失败：' + error.response.data.message)
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

export default <T = any>(config: AxiosRequestConfig) => {
  return request(config).then(res => {
    return (res.data.data || res.data) as T
  })
}
