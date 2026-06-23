import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'
import net from 'net'
import icon from '../../resources/icon.png?asset'
import axios, { AxiosRequestConfig } from 'axios'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
//必须强制开启 9222 调试端口，供 Cline 连接
if (!app.isPackaged) {
  app.commandLine.appendSwitch('remote-debugging-port', '9222')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Open local log folder
  ipcMain.on('open-log-folder', () => {
    const logDir = app.getPath('logs')
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true })
    }
    shell.openPath(logDir)
    console.log('open-log-folder:', logDir)
  })

  setupThirdPartyRequestHandler() // 设置第三方请求,设置后，在乔接层配置后，renderer 进程就可以通过 window.thirdApi.requestThirdParty 来调用这个函数了

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// 网络延迟检测：通过 TCP 连接时间测量各节点延迟
interface PingTarget {
  name: string
  host: string
  port: number
}

interface PingResult {
  name: string
  host: string
  latency: number | null
  error?: string
}

function measureLatency(target: PingTarget): Promise<PingResult> {
  return new Promise((resolve) => {
    const start = Date.now()
    const socket = new net.Socket()

    socket.setTimeout(5000)

    socket.on('connect', () => {
      const latency = Date.now() - start
      socket.destroy()
      resolve({ name: target.name, host: target.host, latency })
    })

    socket.on('error', (err) => {
      socket.destroy()
      resolve({ name: target.name, host: target.host, latency: null, error: err.message })
    })

    socket.on('timeout', () => {
      socket.destroy()
      resolve({ name: target.name, host: target.host, latency: null, error: '超时' })
    })

    socket.connect(target.port, target.host)
  })
}

// 保存文件到本地：弹窗选择路径并写入
ipcMain.handle('save-file', async (_event, content: string, defaultName?: string) => {
  const window = BrowserWindow.getFocusedWindow()
  const { canceled, filePath } = await dialog.showSaveDialog(window!, {
    defaultPath: defaultName || 'untitled.txt',
    filters: [{ name: '所有文件', extensions: ['*'] }]
  })
  if (canceled || !filePath) return { success: false, canceled: true }
  await writeFile(filePath, content, 'utf-8')
  return { success: true, filePath }
})

ipcMain.handle('ping-hosts', async () => {
  const targets: PingTarget[] = [
    { name: 'Cloudflare', host: '1.1.1.1', port: 443 },
    { name: '谷歌', host: 'google.com', port: 443 },
    { name: '百度', host: 'baidu.com', port: 443 },
    { name: '本机', host: '127.0.0.1', port: 443 }
  ]
  const results = await Promise.all(targets.map(measureLatency))
  return results
})

//专门用于请求第三方数据
function setupThirdPartyRequestHandler(): void {
  ipcMain.handle('request-third-party', async (_event, config: AxiosRequestConfig) => {
    // 💡 安全核心：你甚至可以把第三方的 BaseURL 和密钥直接写在 Node 环境的环境变量或常量里
    const THIRD_PARTY_API_KEY = 'sk-xxxxxx-your-real-secret-key'

    // 合并配置，自动追加第三方需要的安全请求头
    const secureConfig: AxiosRequestConfig = {
      ...config,
      baseURL: 'https://api.openai.com/v1', //如果ui请求时，带上了域名，这里没有效果
      headers: {
        ...config.headers,
        Authorization: `Bearer ${THIRD_PARTY_API_KEY}`, // 绝不暴露给前端
        'Content-Type': 'application/json'
      }
    }

    try {
      // 借助 Node.js 环境，绕过浏览器的 CORS 跨域限制
      const response = await axios(secureConfig)
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('第三方请求失败:', error.message)
      return {
        success: false,
        error: error.response?.data?.message || error.message || '请求第三方服务异常'
      }
    }
  })
}
