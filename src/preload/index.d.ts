import { ElectronAPI } from '@electron-toolkit/preload'

interface ProcessMemoryInfo {
  residentSet: number
  private: number
  shared: number
}

declare global {
  interface PingResult {
    name: string
    host: string
    latency: number | null
    error?: string
  }

  interface Window {
    electron: ElectronAPI
    api: {
      getMemoryUsage: () => Promise<ProcessMemoryInfo>
      pingHosts: () => Promise<PingResult[]>
      saveFile: (
        content: string,
        defaultName?: string
      ) => Promise<{ success: boolean; canceled?: boolean; filePath?: string }>
    }
    // 在preload乔接层定义第三方请求的类型，才可以使用window.thirdAPi，用来在preload/index.ts中定义，
    //不声明的话，无法赋值，也就意味着render层无法调用
    thirdApi: {
      // requestThirdParty: (config: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      requestThirdParty: <T = any>(
        config: any
      ) => Promise<{
        success: boolean
        data?: {
          code: number
          message: string
          data: T
        }
        error?: string
      }>
    }
  }
}
