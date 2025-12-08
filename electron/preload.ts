import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Controles da janela
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  
  // Arquivos
  saveFile: (content: string, defaultName: string) => 
    ipcRenderer.invoke('save-file', content, defaultName),
  openFile: () => 
    ipcRenderer.invoke('open-file'),
})

// Tipos para TypeScript
declare global {
  interface Window {
    electronAPI: {
      minimizeWindow: () => void
      maximizeWindow: () => void
      closeWindow: () => void
      saveFile: (content: string, defaultName: string) => Promise<{ success: boolean; path?: string }>
      openFile: () => Promise<{ success: boolean; content?: string; path?: string }>
    }
  }
}

