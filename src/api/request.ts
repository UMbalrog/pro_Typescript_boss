import axios from 'axios'
import store from '../store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

function redirectLogin () { // 未登录直接去登录页
  router.push({
    path: '/login',
    query: {
      // 登录完跳转回当前页的地址
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      // refresh_token 只能使用1次
      refreshtoken: store.state.user.refresh_token
    })
  })
}

const instance = axios.create({
  baseURL: '/',
  timeout: 10000
})
// 请求拦截器
instance.interceptors.request.use(
  config => {
    // console.log(config);
    const { user } = store.state
    if (user && user.access_token) {
      config.headers.Authorization = user.access_token
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)
let isRfreshing = false // 控制刷新状态
let requests: Function[] = [] // 存储刷新 token 期间过来的 401 请求
// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 2开头的状态码都在这里
    // 项目如果是自定义错误码，都在这里处理
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  async error => {
    // 其他开头的状态码都在这里
    // 项目如果是使用的http的错误码，都在这里处理
    // console.dir(error)
    if (error.response) { // 请求发出去收到响应了，但是状态码超出了 2xx 范围
      const { status } = error.response
      if (status === 400) {
        Message.error('请求参数错误')
      } else if (status === 401) { // token 无效（没有提供 token、token 是无效的、token 过期了）
        if (!store.state.user) {
          redirectLogin()
          return Promise.reject(error)
        }
        // 如果有 refresh_token 则尝试使用 refresh_token 获取新的 access_token
        // 这里注意要新建一个请求体，避免同一个请求体再次进入401，死循环
        if (!isRfreshing) {
          isRfreshing = true
          return refreshToken().then(res => {
            // 刷新 token 成功了
            if (!res.data.success) {
              throw new Error('刷新 Token 失败')
            }
            // 存入新token
            store.commit('setUser', res.data.content)
            // 成功后执行之前的失败的请求
            requests.forEach(cb => cb())
            // 执行完毕清空
            requests = []
            // 发送之前请求
            return instance(error.config)
          }).catch(() => {
            // 失败了
            // console.log(err)
            Message.warning('登录已过期，请重新登录')
            store.commit('setUser', null)
            redirectLogin()
            return Promise.reject(error)
          }).finally(() => {
            isRfreshing = false // 重置刷新状态
          })
        }
        // 刷新状态下，把请求挂起放到 requests 数组中
        // 这里收集未成功的请求把重新请求的结果返给这次
        return new Promise((resolve) => {
          requests.push(() => {
            resolve(instance(error.config))
          })
        })
      } else if (status === 403) {
        Message.error('没有权限，请联系管理员')
      } else if (status === 404) {
        Message.error('请求资源不存在')
      } else if (status >= 500) {
        Message.error('服务端错误，请联系管理员')
      }
    } else if (error.request) { // 请求发出去没有收到响应，请求超时
      Message.error('请求超时，请刷新重试')
    } else { // 在设置请求时发生了一些事情，触发了一个错误
      Message.error(`请求失败：${error.message}`)
    }
    // 把请求失败的错误对象继续抛出，扔给上一个调用者
    return Promise.reject(error)
  }
)

export default instance
