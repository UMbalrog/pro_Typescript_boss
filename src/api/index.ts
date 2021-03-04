import axios from 'axios'

const instance = axios.create({
  baseURL: '/',
  timeout: 10000
})
// 请求拦截器
instance.interceptors.request.use(
  config => {
    // console.log(config);
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default instance
