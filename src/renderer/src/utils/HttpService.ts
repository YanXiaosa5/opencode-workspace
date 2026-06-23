import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 1. 定义后端返回的标准数据结构（根据你的实际后端格式进行调整）
export interface ApiResponse<T = any> {
  code: number // 状态码，例如 200 成功，401 未登录，500 错误
  data: T // 具体的数据内容，使用泛型 T 承载
  message: string // 错误或提示信息
}

class HttpService {
  private instance: AxiosInstance

  constructor() {
    // 2. 创建 axios 实例，配置基础参数
    this.instance = axios.create({
      baseURL: 'https://api.your-domain.com', // 你的 API 基础路径
      timeout: 10000, // 超时时间 10 秒
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // 3. 初始化拦截器
    this.setupInterceptors()
  }

  // 拦截器配置
  private setupInterceptors() {
    // 请求拦截器：可以在这里统一追加 Token 等鉴权信息
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token') // 或者从你的状态管理中获取
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器：统一处理各类网络状态码和业务状态码
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 直接返回后端约定的数据包裹（即 ApiResponse）
        return response.data
      },
      (error) => {
        // 统一处理 HTTP 错误状态码（404, 500, 403 等）
        let errorMsg = '网络连接异常，请稍后再试'
        if (error.response) {
          switch (error.response.status) {
            case 401:
              errorMsg = '登录已过期，请重新登录'
              // 这里可以触发退出登录逻辑、清除本地缓存等
              break
            case 403:
              errorMsg = '拒绝访问'
              break
            case 404:
              errorMsg = '请求地址错误'
              break
            case 500:
              errorMsg = '服务器内部错误'
              break
            default:
              errorMsg = error.response.data?.message || errorMsg
          }
        }

        // 实际项目中这里可以结合 UI 组件（如 message.error 或 Toast）弹出提示
        console.error('【HTTP ERROR】', errorMsg)

        return Promise.reject(new Error(errorMsg))
      }
    )
  }

  // 4. 封装核心请求方法（支持泛型传递）
  public request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.request<any, ApiResponse<T>>(config)
  }

  public get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, params, ...config })
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data, ...config })
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data, ...config })
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, ...config })
  }
}

// 导出单例，确保整个项目全局复用同一个连接池和拦截器
const http = new HttpService()
export default http

//example of usage:

// interface UserProfile {
//   uid: string;
//   nickname: string;
//   avatar: string;
//   email: string;
// }
//const res = await http.get<UserProfile>('/api/user/profile', { id: '12345' });
