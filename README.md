# 🎬 TelePrompterBrasil

O melhor aplicativo de teleprompter para Windows e Mac.

![TelePrompterBrasil](public/icon.svg)

## ✨ Funcionalidades

### Versão 2.0.0 (Novidades!)
- ✅ **Persistência de Dados** - Scripts e configurações salvos automaticamente no localStorage
- ✅ **Salvar Explícito** - Controle total sobre quando salvar (sem auto-save agressivo)
- ✅ **Indicador de Status** - Visual claro de "● Alterações não salvas" / "✓ Salvo"
- ✅ **Confirmação ao Cancelar** - Pergunta se deseja descartar alterações não salvas
- ✅ **Timer Remaining** - Mostra tempo restante estimado (R: MM:SS)
- ✅ **Timed Scrolling** - Define tempo total e velocidade é calculada automaticamente
- ✅ **Always on Top** - Janela sempre visível sobre outros aplicativos
- ✅ **UI Responsiva** - Barra de controles não oculta mais botões com sidebar aberta

### Versão 1.1.0
- ✅ **Janela Externa (HDMI)** - Suporte nativo a múltiplos monitores
- ✅ **Editor "Cinema Mode"** - Fundo escuro, Largura Real e Smart Caps
- ✅ **Cue Points Visual** - Navegação rápida entre seções

### Funcionalidades Principais
- ✅ **Teleprompter** - Scroll automático ultra-fluido
- ✅ **Controle de Velocidade** - Ajuste de 0.5x a 10x (manual ou temporizado)
- ✅ **Espelhamento** - Inverte o texto horizontalmente
- ✅ **Timer Duplo** - Cronômetro decorrido + tempo restante
- ✅ **Cue Line** - Linha de referência visual personalizável
- ✅ **Ajuste de Fonte** - Tamanho personalizável (24px - 96px)
- ✅ **Atalhos de Teclado** - Controle rápido
- ✅ **Importar/Exportar** - Arquivos .txt / .html

### Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `Espaço` | Play/Pause |
| `↑` | Aumentar velocidade |
| `↓` | Diminuir velocidade |
| `R` | Resetar posição |
| `M` | Espelhar texto |
| `E` | Modo edição |
| `F` | Tela cheia |

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento (browser)
npm run dev

# Rodar em modo Electron
npm run electron:dev
```

### Build

```bash
# Build para Windows
npm run build:win

# Build para Mac
npm run build:mac
```

## 🛠️ Tecnologias

- **Electron 28** - App desktop nativo
- **React 18** - Interface do usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **Framer Motion** - Animações suaves
- **Zustand** - Gerenciamento de estado com persistência

## 📁 Estrutura do Projeto

```
telepronpter/
├── electron/               # Código Electron (main process)
│   ├── main.ts             # Janela principal + IPC handlers
│   └── preload.ts          # API segura para renderer
├── src/                    # Código React (renderer)
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Entry point React
│   ├── index.css           # Design system completo
│   ├── electron.d.ts       # Tipos da API Electron
│   ├── types/index.ts      # Interfaces TypeScript
│   ├── store/
│   │   └── useAppStore.ts  # Estado global (Zustand + persist)
│   ├── components/
│   │   ├── Editor/
│   │   │   ├── RichEditor.tsx         # Editor de scripts
│   │   │   └── FormattingToolbar.tsx   # Barra de formatação
│   │   ├── Controls/
│   │   │   ├── PlaybackControls.tsx    # Controles de reprodução
│   │   │   └── SettingsPanel.tsx       # Painel de configurações
│   │   └── Prompter/
│   │       ├── TeleprompterDisplay.tsx # Display do teleprompter
│   │       └── CueIndicator.tsx       # Indicador de cue
│   ├── hooks/
│   │   └── useWindowSync.ts # Sincronização multi-janela
│   └── routes/
│       └── ExternalWindow.tsx # Janela externa HDMI
├── public/                 # Assets estáticos
├── package.json
└── vite.config.ts
```

## 📋 Changelog

### v2.0.0
- **Persistência**: Scripts e configurações salvos no localStorage via Zustand persist middleware
- **Novo Sistema de Salvamento**: Removido auto-save agressivo, adicionado botão "Salvar e Visualizar" explícito
- **Indicador Dirty**: Status visual "● Alterações não salvas" (vermelho) / "✓ Salvo" (verde)
- **Confirmação ao Cancelar**: Diálogo de confirmação ao tentar fechar editor com alterações
- **Timer Remaining**: Cálculo e exibição do tempo restante baseado na velocidade e posição
- **Timed Scrolling**: Modo temporizado que calcula velocidade automaticamente para terminar no tempo desejado
- **Always on Top**: Opção para manter janela sempre visível (via Electron IPC)
- **Fix UI**: Botão de tela cheia não some mais quando sidebar está expandida
- **CSS Timed Toggle**: Botão estilizado para alternar entre modo Manual e TIMED

### v1.1.0
- Janela Externa (HDMI) com sincronização via IPC
- Editor "Cinema Mode"
- Auto-Save (removido na v2.0.0)
- Cue Points Visual

## 📝 Licença

MIT © TelePrompterBrasil

---

Feito com ❤️ no Brasil
