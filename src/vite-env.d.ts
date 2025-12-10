/// <reference types="vite/client" />

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

