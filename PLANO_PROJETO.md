# 🎬 TelePrompter Desktop - Plano de Implementação

## 📊 Visão Geral

**Objetivo:** Criar um aplicativo de teleprompter nativo para Windows e Mac, similar ao Teleprompter Pro.

**Plataformas:** Windows 10/11 + macOS

**Stack Tecnológica:** Electron + React + TypeScript

---

## 🎯 Por que Electron + React?

| Critério | Electron + React |
|----------|------------------|
| **Cross-platform** | ✅ Windows + Mac + Linux |
| **Acesso Webcam** | ✅ WebRTC nativo |
| **UI Moderna** | ✅ React + CSS flexível |
| **Gravação Vídeo** | ✅ MediaRecorder API |
| **Saída Externa** | ✅ Multi-window support |
| **Desenvolvimento** | ✅ Rápido, hot reload |
| **Comunidade** | ✅ Gigantesca |

---

## 🚀 Features - MVP (Versão 1.0)

### Core Teleprompter
- [ ] Editor de texto/script
- [ ] Scroll automático com velocidade ajustável
- [ ] Play/Pause/Reset controles
- [ ] Espelhamento horizontal (para vidro teleprompter)
- [ ] Indicador de Cue (linha de referência)
- [ ] Ajuste de fonte (tamanho, cor, família)
- [ ] Fundo personalizável (cor, opacidade)
- [ ] Timer/cronômetro integrado

### Gravação de Vídeo
- [ ] Preview da webcam
- [ ] Seleção de câmera (múltiplas câmeras)
- [ ] Gravar vídeo com script sobreposto
- [ ] Salvar em MP4/WebM

### Gestão de Scripts
- [ ] Criar/Editar scripts
- [ ] Salvar/Carregar scripts (.txt, .rtf, .docx)
- [ ] Lista de scripts recentes
- [ ] Auto-save

### Controles
- [ ] Atalhos de teclado configuráveis
- [ ] Controle via mouse scroll
- [ ] Barra de progresso visual

---

## 🎯 Features - Versão 2.0 (Futuro)

### Avançado
- [ ] Saída de vídeo externa (segunda janela/monitor)
- [ ] Clean feed (sem UI) para output
- [ ] Controle remoto via WebSocket (outro dispositivo)
- [ ] Importação de Google Docs/Notion
- [ ] Sincronização na nuvem
- [ ] Modo apresentação (fullscreen)
- [ ] Suporte a controles externos (gamepad)
- [ ] Múltiplos marcadores no script
- [ ] Voice-activated scroll (futuro)

---

## 📁 Estrutura do Projeto

```
tele/
├── package.json
├── electron/
│   ├── main.ts              # Processo principal Electron
│   ├── preload.ts           # Bridge seguro
│   └── ipc/                  # Comunicação IPC
│       └── handlers.ts
├── src/
│   ├── App.tsx              # Componente raiz
│   ├── main.tsx             # Entry point React
│   ├── index.css            # Estilos globais
│   ├── components/
│   │   ├── Teleprompter/
│   │   │   ├── Teleprompter.tsx
│   │   │   ├── ScrollText.tsx
│   │   │   ├── Controls.tsx
│   │   │   ├── CueIndicator.tsx
│   │   │   └── Timer.tsx
│   │   ├── Editor/
│   │   │   ├── ScriptEditor.tsx
│   │   │   └── Toolbar.tsx
│   │   ├── VideoRecorder/
│   │   │   ├── CameraPreview.tsx
│   │   │   ├── RecordButton.tsx
│   │   │   └── CameraSelector.tsx
│   │   ├── Settings/
│   │   │   ├── SettingsPanel.tsx
│   │   │   ├── FontSettings.tsx
│   │   │   └── KeyboardShortcuts.tsx
│   │   └── Layout/
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── MainLayout.tsx
│   ├── hooks/
│   │   ├── useTeleprompter.ts
│   │   ├── useCamera.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   └── useScriptStorage.ts
│   ├── stores/
│   │   ├── teleprompterStore.ts
│   │   ├── settingsStore.ts
│   │   └── scriptsStore.ts
│   ├── utils/
│   │   ├── fileHandlers.ts
│   │   ├── timeFormatter.ts
│   │   └── textMirror.ts
│   └── types/
│       └── index.ts
├── public/
│   └── icons/
└── resources/               # Ícones do app
```

---

## 🎨 Design/UI Conceito

### Cores (Tema Escuro - Padrão)
- Background: #0D0D0D (quase preto)
- Surface: #1A1A1A
- Primary: #00D9FF (cyan vibrante)
- Text: #FFFFFF
- Accent: #FF6B35 (laranja para rec)

### Layout Principal
```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  TelePrompter       [Settings] [Minimize] [X]   │
├────────────┬────────────────────────────────────────────┤
│            │                                            │
│  SCRIPTS   │     ████████████████████████████████       │
│  ────────  │     ██                              ██     │
│  > Script1 │     ██    TEXTO DO TELEPROMPTER     ██     │
│    Script2 │     ██    QUE VAI ROLANDO           ██     │
│    Script3 │     ██    AUTOMATICAMENTE...        ██     │
│            │     ██ ─────────────────────────────██     │ ← Cue Line
│            │     ██    próximas linhas           ██     │
│            │     ██    do script aqui            ██     │
│  ────────  │     ████████████████████████████████       │
│  [+ Novo]  │                                            │
│            ├────────────────────────────────────────────┤
│            │  ▶ Play  ⏸ Pause  🔄 Reset  Speed: ████░░  │
│            │  ⏱ 00:00 / 03:45          [🔴 REC]         │
└────────────┴────────────────────────────────────────────┘
```

---

## 📅 Cronograma Estimado

| Fase | Descrição | Tempo |
|------|-----------|-------|
| **Fase 1** | Setup + Estrutura base | 1 dia |
| **Fase 2** | Teleprompter core (scroll, controles) | 2-3 dias |
| **Fase 3** | Editor de scripts | 1-2 dias |
| **Fase 4** | Gravação de vídeo | 2 dias |
| **Fase 5** | Settings + Atalhos | 1 dia |
| **Fase 6** | Polish + Testes | 1-2 dias |
| **TOTAL MVP** | | **~10 dias** |

---

## 🔧 Dependências Principais

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "zustand": "^4.x",        // State management (leve)
    "framer-motion": "^10.x", // Animações suaves
    "lucide-react": "^0.x",   // Ícones modernos
    "mammoth": "^1.x"         // Ler .docx
  },
  "devDependencies": {
    "electron": "^28.x",
    "electron-builder": "^24.x",
    "vite": "^5.x",
    "typescript": "^5.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

---

## ✅ Próximos Passos

1. [x] Criar plano de implementação
2. [ ] Inicializar projeto Electron + Vite + React
3. [ ] Criar estrutura de pastas
4. [ ] Implementar layout base
5. [ ] Criar componente Teleprompter
6. [ ] Adicionar controles de scroll
7. [ ] Implementar editor de scripts
8. [ ] Adicionar gravação de vídeo
9. [ ] Settings e atalhos
10. [ ] Build para Windows e Mac

---

## 📝 Notas

- Usaremos **Vite** como bundler (muito mais rápido que webpack)
- **Zustand** para state (mais simples que Redux)
- **Framer Motion** para animações suaves no scroll
- Build com **electron-builder** para distribuição


