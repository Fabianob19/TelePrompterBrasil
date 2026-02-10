// Type declarations for Electron API exposed via preload script
declare global {
    interface Window {
        electronAPI: {
            // Window controls
            minimizeWindow: () => void
            maximizeWindow: () => void
            closeWindow: () => void

            // File operations
            saveFile: (content: string, defaultName: string) => Promise<{ success: boolean; path?: string }>
            openFile: () => Promise<{ success: boolean; content?: string; path?: string }>

            // External window
            createExternalWindow: () => void
            closeExternalWindow: () => void

            // State sync
            sendSyncState: (state: any) => void
            onSyncState: (callback: (state: any) => void) => () => void

            // Window settings
            setAlwaysOnTop: (value: boolean) => void
        }
    }
}

export { }
