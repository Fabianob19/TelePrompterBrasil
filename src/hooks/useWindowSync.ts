import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

export function useWindowSync(isMain: boolean) {
    // 1. Mestre (Janela Principal) envia atualizações
    useEffect(() => {
        if (!isMain) return

        // Função para enviar estado atual
        const sendCurrentState = () => {
            const state = useAppStore.getState()
            const syncData = {
                playback: state.playback,
                activeScriptId: state.activeScriptId,
                scriptContent: state.scripts.find(s => s.id === state.activeScriptId)?.content,
                settings: state.settings
            }
            if (window.electronAPI && window.electronAPI.sendSyncState) {
                window.electronAPI.sendSyncState(syncData)
            }
        }

        // Enviar estado inicial imediatamente e usar heartbeat para pegar janelas recém-abertas
        sendCurrentState()
        const heartbeat = setInterval(sendCurrentState, 500)

        // Subscrever à store e enviar mudanças
        let timeout: NodeJS.Timeout

        const unsub = useAppStore.subscribe((state) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                const syncData = {
                    playback: state.playback,
                    activeScriptId: state.activeScriptId,
                    scriptContent: state.scripts.find(s => s.id === state.activeScriptId)?.content,
                    settings: state.settings
                }
                if (window.electronAPI && window.electronAPI.sendSyncState) {
                    window.electronAPI.sendSyncState(syncData)
                }
            }, 16)
        })

        return () => {
            unsub()
            clearTimeout(timeout)
            clearInterval(heartbeat)
        }
    }, [isMain])

    // 2. Escravo (Janela Externa) recebe atualizações
    useEffect(() => {
        if (isMain) return
        if (!window.electronAPI) return

        const unsub = window.electronAPI.onSyncState((state: any) => {
            // Atualizar store local
            if (state.playback) useAppStore.setState({ playback: state.playback })
            if (state.settings) useAppStore.setState({ settings: state.settings })

            // Atualizar script se mudou
            if (state.activeScriptId) {
                useAppStore.setState(s => {
                    // Se o script já existe, atualiza content. Se não, cria um placeholder.
                    const exists = s.scripts.find(sc => sc.id === state.activeScriptId)
                    if (exists) {
                        return {
                            activeScriptId: state.activeScriptId,
                            scripts: s.scripts.map(sc => sc.id === state.activeScriptId ? { ...sc, content: state.scriptContent } : sc)
                        }
                    } else {
                        return {
                            activeScriptId: state.activeScriptId,
                            scripts: [...s.scripts, {
                                id: state.activeScriptId,
                                name: 'Synced Script',
                                content: state.scriptContent,
                                createdAt: new Date()
                            }]
                        }
                    }
                })
            }
        })

        return () => unsub()
    }, [isMain])
}
