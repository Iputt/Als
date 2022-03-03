import Taro from '@tarojs/taro'
import { HTTP_STATUS } from './HTTP_STATUS'
import config from '../config'
import { logError } from '../utils/common'

const BASE_URL: string = config['development']
// const BASE_URL: string = config['production']
type OptionType = {
  url: string
  data?: object | string
  method?: any
  header: object
  success: any
  error: any
  // xhrFields: object
}

export default {
  BASE_OPTIONS(params, method = 'GET') {
    console.log(BASE_URL, '---', HTTP_STATUS)
    const { url, data } = params
    let contentType = 'application/json'
    contentType = params.contentType || contentType
    let options: OptionType = {
      url: url.indexOf('http') != -1 ? url : BASE_URL + url,
      method,
      data: {
        ...data,
        timestamp: new Date().getTime()
      },
      header: {
        'content-type': contentType,
        platform_id: 1
      },
      // xhrFields: { withCredentials: true },
      success: res => {
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return logError('api', '没有权限访问')
        } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
          Taro.clearStorage()
          // Taro.navigateTo({
          //   url: '/pages/packageA/pages/login/index'
          // })
          return logError('api', '请先登录')
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          return res.data
        }
      },
      error: e => {
        logError('api', '请求接口出现问题', e)
      }
    }
    return new Promise((resolve, reject) => {
      Taro.request(options)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  GET(url: string, data?: object) {
    let option = { url, data }
    return this.BASE_OPTIONS(option)
  },
  POST(url: string, data?: object, contentType?: string) {
    let option = { url, data, contentType }
    return this.BASE_OPTIONS(option, 'POST')
  },
  PUT(url: string, data?: object) {
    let option = { url, data }
    return this.BASE_OPTIONS(option, 'PUT')
  },
  DELETE(url: string, data?: object) {
    let option = { url, data }
    return this.BASE_OPTIONS(option, 'DELETE')
  }
}
