import request from './request'
import qs from 'qs'

interface User{
  phone: string;
  password: string;
}
export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // 如果 data 是普通对象，则 Content-Type 是 application/json
    // 如果 data 是 qs.stringify(data) 转换之后的数据：key=value&key=value，则 Content-Type 会被设置为 application/x-www-form-urlencoded
    // 如果 data 是 FormData 对象，则 Content-Type 是 multipart/form-data
    // 以上情况 content-type 可以不用手动设置
    data: qs.stringify(data)
  })
}
