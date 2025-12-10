import { create } from 'zustand'
import { Script, AppSettings, PlaybackState } from '../types'

interface AppState {
    // Data
    scripts: Script[]
    activeScriptId: string

    // Settings
    settings: AppSettings

    // Playback
    playback: PlaybackState

    // Actions
    addScript: () => void
    deleteScript: (id: string) => void
    updateScript: (id: string, updates: Partial<Script>) => void
    setActiveScriptId: (id: string) => void

    updateSettings: (updates: Partial<AppSettings>) => void

    updatePlayback: (updates: Partial<PlaybackState>) => void
    togglePlay: () => void
    resetPlayback: () => void
    triggerCueAction: (type: 'next' | 'prev') => void
}

const DEFAULT_SCRIPT: Script = {
    id: '1',
    name: 'Bem-vindo',
    content: `Bem-vindo ao TelePrompterBrasil!

Este é seu sistema profissional de leitura.

>>>

SEÇÃO 1: NOVA TELA EXTERNA

Agora você pode usar um monitor HDMI dedicado!
1. Vá em Configurações (engrenagem).
2. Clique em "Abrir Janela Externa".
3. Arraste a nova janela para o segundo monitor.

O texto fica sincronizado perfeitamente.

>>>

SEÇÃO 2: NOVO EDITOR "CINEMA MODE"

Pressione 'E' para abrir o editor atualizado:

• Fundo Preto: Conforto visual total.
• Largura Real: Simula o tamanho da TV.
• Botão [TT]: Transforma texto em MAIÚSCULAS.
• Paste Limpo: Cole sem formatação indesejada.
• Auto-Save: Salvamento automático.

>>>

SEÇÃO 3: CONTROLES BÁSICOS

• Espaço ou Play: Inicia a rolagem.
• Setas ↑ ↓: Ajustam velocidade.
• Roda do Mouse: Avança ou volta o texto.

>>>

SEÇÃO 4: CUE POINTS (MARCADORES)

Os >>> que você vê são Cue Points.
Eles dividem seu texto em capítulos.

Use os botões ⏮️ ⏭️ na barra inferior
para pular instantaneamente entre eles.

Boa gravação!`,
    createdAt: new Date()
}

const DEFAULT_SETTINGS: AppSettings = {
    fontSize: 48,
    isMirrored: false,
    cueEnabled: true,
    cueStyle: 'full',
    cuePosition: 38,
    cueColor: '#30d158',
    cueOpacity: 100,
    cueThickness: 2,
    sidebarCollapsed: false
}

export const useAppStore = create<AppState>((set) => ({
    // Initial State
    scripts: [DEFAULT_SCRIPT],
    activeScriptId: '1',

    settings: DEFAULT_SETTINGS,

    playback: {
        isPlaying: false,
        speed: 2,
        scrollPosition: 0,
        elapsedTime: 0
    },

    // Actions
    addScript: () => set((state) => {
        const newScript: Script = {
            id: Date.now().toString(),
            name: `Script ${state.scripts.length + 1}`,
            content: '',
            createdAt: new Date()
        }
        return {
            scripts: [...state.scripts, newScript],
            activeScriptId: newScript.id
        }
    }),

    deleteScript: (id) => set((state) => {
        if (state.scripts.length <= 1) return state

        const newScripts = state.scripts.filter(s => s.id !== id)
        let newActiveId = state.activeScriptId

        if (state.activeScriptId === id) {
            newActiveId = newScripts[0].id
        }

        return { scripts: newScripts, activeScriptId: newActiveId }
    }),

    updateScript: (id, updates) => set((state) => ({
        scripts: state.scripts.map(s => s.id === id ? { ...s, ...updates } : s)
    })),

    setActiveScriptId: (id) => set({ activeScriptId: id }),

    updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
    })),

    updatePlayback: (updates) => set((state) => ({
        playback: { ...state.playback, ...updates }
    })),

    togglePlay: () => set((state) => ({
        playback: { ...state.playback, isPlaying: !state.playback.isPlaying }
    })),

    resetPlayback: () => set((state) => ({
        playback: { ...state.playback, isPlaying: false, scrollPosition: 0, elapsedTime: 0 }
    })),

    triggerCueAction: (type) => set((state) => ({
        playback: {
            ...state.playback,
            cueAction: { type, id: Date.now() }
        }
    }))
}))
