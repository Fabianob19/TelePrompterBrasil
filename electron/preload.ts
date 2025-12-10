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

  // External Window
  createExternalWindow: () => ipcRenderer.send('create-external-window'),
  closeExternalWindow: () => ipcRenderer.send('close-external-window'),

  // Sync
  sendSyncState: (state: any) => ipcRenderer.send('sync-state', state),
  onSyncState: (callback: (state: any) => void) => {
    const subscription = (_: any, state: any) => callback(state)
    ipcRenderer.on('sync-state', subscription)
    return () => ipcRenderer.removeListener('sync-state', subscription)
  }
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

      createExternalWindow: () => void
      closeExternalWindow: () => void
      sendSyncState: (state: any) => void
      onSyncState: (callback: (state: any) => void) => () => void
    }
  }
}
