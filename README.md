# 🎬 TelePrompterBrasil

O melhor aplicativo de teleprompter para Windows e Mac.

![TelePrompterBrasil](public/icon.svg)

## ✨ Funcionalidades

### Versão 1.1.0 (Novidades!)
- ✅ **Janela Externa (HDMI)** - Suporte nativo a múltiplos monitores
- ✅ **Editor "Cinema Mode"** - Fundo escuro, Largura Real e Smart Caps
- ✅ **Auto-Save** - Salvamento automático e invisível
- ✅ **Cue Points Visual** - Navegação rápida entre seções

### Funcionalidades Principais
- ✅ **Teleprompter** - Scroll automático ultra-fluido
- ✅ **Controle de Velocidade** - Ajuste de 1x a 10x
- ✅ **Espelhamento** - Inverte o texto horizontalmente
- ✅ **Timer** - Cronômetro integrado
- ✅ **Cue Line** - Linha de referência visual
- ✅ **Ajuste de Fonte** - Tamanho personalizável
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

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
```

### Build

```bash
# Build para Windows
npm run build:win

# Build para Mac
npm run build:mac
```

## 🛠️ Tecnologias

- **Electron** - App desktop nativo
- **React 18** - Interface do usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **Framer Motion** - Animações suaves
- **Zustand** - Gerenciamento de estado

## 📁 Estrutura do Projeto

```
tele/
├── electron/           # Código Electron (main process)
│   ├── main.ts
│   └── preload.ts
├── src/                # Código React (renderer)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/             # Assets estáticos
├── package.json
└── vite.config.ts
```

## 📝 Licença

MIT © TelePrompterBrasil

---

Feito com ❤️ no Brasil

