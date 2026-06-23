import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

interface PingResult {
  name: string
  host: string
  latency: number | null
  error?: string
}

// Custom APIs for renderer
const api = {
  getMemoryUsage: () => {
    const info = process.memoryUsage()
    return {
      residentSet: info.rss,
      private: info.heapUsed,
      shared: info.heapTotal - info.heapUsed
    }
  },
  pingHosts: (): Promise<PingResult[]> => ipcRenderer.invoke('ping-hosts'),
  saveFile: (
    content: string,
    defaultName?: string
  ): Promise<{ success: boolean; canceled?: boolean; filePath?: string }> =>
    ipcRenderer.invoke('save-file', content, defaultName)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)

    //在preload乔接层暴露一个第三方请求的接口，renderer 进程就可以通过 window.thirdApi.requestThirdParty 来调用这个函数了
    contextBridge.exposeInMainWorld('thirdApi', {
      // 暴露一个给 React 调用的异步函数
      requestThirdParty: (config: any) => ipcRenderer.invoke('request-third-party', config)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts).  直接修改全局对象，不符合规范，必须加上 ts-ignore 注释
  window.api = api(window as Record<string, any>).thirdApi = {
    requestThirdParty: (config: any) => ipcRenderer.invoke('request-third-party', config)
  }
}
