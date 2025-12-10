import { app, BrowserWindow, ipcMain, dialog, screen } from 'electron'
import path from 'path'
import fs from 'fs'

let mainWindow: BrowserWindow | null = null
let externalWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, '../public/icon.png')
  })

  // Em desenvolvimento, carrega do servidor Vite
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    // Em produção, carrega o arquivo HTML buildado
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
    // Se fechar a principal, fecha a externa também
    if (externalWindow) {
      externalWindow.close()
      externalWindow = null
    }
  })
}

function createExternalWindow() {
  if (externalWindow) {
    externalWindow.focus()
    return
  }

  const displays = screen.getAllDisplays()
  // Tenta pegar o segundo monitor, senão pega o principal
  const externalDisplay = displays.length > 1 ? displays[1] : displays[0]

  externalWindow = new BrowserWindow({
    x: externalDisplay.bounds.x,
    y: externalDisplay.bounds.y,
    width: 1280,
    height: 720,
    frame: false, // Sem bordas
    fullscreen: true, // Tela cheia
    backgroundColor: '#000000', // Fundo preto
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, '../public/icon.png')
  })

  const url = process.env.NODE_ENV === 'development' || !app.isPackaged
    ? 'http://localhost:5173/#/external'
    : `file://${path.join(__dirname, '../dist/index.html')}#/external`

  externalWindow.loadURL(url)

  externalWindow.on('closed', () => {
    externalWindow = null
    // Notificar janela principal que fechou?
    mainWindow?.webContents.send('external-window-closed')
  })
}

// Controles da janela
ipcMain.on('window-minimize', () => {
  mainWindow?.minimize()
})

ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.on('window-close', () => {
  mainWindow?.close()
})

// Salvar arquivo
ipcMain.handle('save-file', async (_, content: string, defaultName: string) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: defaultName,
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, content, 'utf-8')
    return { success: true, path: result.filePath }
  }
  return { success: false }
})

// Abrir arquivo
ipcMain.handle('open-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'md'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (!result.canceled && result.filePaths.length > 0) {
    const content = fs.readFileSync(result.filePaths[0], 'utf-8')
    return { success: true, content, path: result.filePaths[0] }
  }
  return { success: false }
})



// === External Window IPC ===
ipcMain.on('create-external-window', () => {
  createExternalWindow()
})

ipcMain.on('close-external-window', () => {
  externalWindow?.close()
})

// Sync State: Recebe do MainRenderer e envia para ExternalRenderer
ipcMain.on('sync-state', (_, state) => {
  if (externalWindow && !externalWindow.isDestroyed()) {
    externalWindow.webContents.send('sync-state', state)
  }
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

