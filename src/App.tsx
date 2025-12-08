import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Plus, 
  FileText,
  X,
  FlipHorizontal,
  Edit3,
  Eye,
  Save,
  FolderOpen,
  Trash2,
  Maximize,
  Minimize2,
  Type,
  Clock,
  ChevronLeft,
  ChevronRight,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Highlighter,
  RemoveFormatting,
  SkipBack,
  SkipForward,
  MapPin
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Tipos
interface Script {
  id: string
  name: string
  content: string
  createdAt: Date
}

// Tipos de estilo do Cue Indicator - 7 estilos exatos do Teleprompter Pro
type CueStyleType = 
  | 'arrow-left'        // 1. Seta só na esquerda ▶
  | 'arrow-left-line'   // 2. Seta esquerda + linha ▶━━━
  | 'full'              // 3. Seta esquerda + linha + seta direita ▶━━━◀
  | 'line-arrow-right'  // 4. Linha + seta direita ━━━◀
  | 'arrow-right'       // 5. Seta só na direita ◀
  | 'arrows-only'       // 6. Seta esquerda + seta direita (sem linha) ▶  ◀
  | 'line-only'         // 7. Somente linha ━━━━━

interface CueIndicatorProps {
  style: CueStyleType
  position: number
  color: string
  opacity: number
  thickness: number
}

// Componente Cue Indicator - 7 estilos exatos como Teleprompter Pro
function CueIndicator({ style, position, color, opacity, thickness }: CueIndicatorProps) {
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: `${position}%`,
    transform: 'translateY(-50%)',
    opacity: opacity / 100,
    pointerEvents: 'none',
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
  }

  const glowFilter = `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px ${color}60)`
  
  // Seta apontando para DIREITA (lado esquerdo da tela) ▶
  const ArrowRight = () => (
    <svg width="18" height="22" viewBox="0 0 18 22" style={{ filter: glowFilter, flexShrink: 0 }}>
      <polygon points="0,0 18,11 0,22" fill={color} />
    </svg>
  )
  
  // Seta apontando para ESQUERDA (lado direito da tela) ◀
  const ArrowLeft = () => (
    <svg width="18" height="22" viewBox="0 0 18 22" style={{ filter: glowFilter, flexShrink: 0 }}>
      <polygon points="18,0 0,11 18,22" fill={color} />
    </svg>
  )
  
  // Linha horizontal
  const Line = () => (
    <div style={{
      flex: 1,
      height: `${thickness}px`,
      background: color,
      boxShadow: `0 0 6px ${color}, 0 0 15px ${color}50`,
    }} />
  )

  // Estilo 1: Seta só na ESQUERDA ▶
  if (style === 'arrow-left') {
    return (
      <div style={containerStyle}>
        <ArrowRight />
      </div>
    )
  }

  // Estilo 2: Seta esquerda + linha ▶━━━━━
  if (style === 'arrow-left-line') {
    return (
      <div style={containerStyle}>
        <ArrowRight />
        <Line />
      </div>
    )
  }

  // Estilo 3: Seta esquerda + linha + seta direita ▶━━━━◀ (COMPLETO)
  if (style === 'full') {
    return (
      <div style={containerStyle}>
        <ArrowRight />
        <Line />
        <ArrowLeft />
      </div>
    )
  }

  // Estilo 4: Linha + seta na direita ━━━━━◀
  if (style === 'line-arrow-right') {
    return (
      <div style={containerStyle}>
        <Line />
        <ArrowLeft />
      </div>
    )
  }

  // Estilo 5: Seta só na DIREITA ◀
  if (style === 'arrow-right') {
    return (
      <div style={{ ...containerStyle, justifyContent: 'flex-end' }}>
        <ArrowLeft />
      </div>
    )
  }

  // Estilo 6: Seta esquerda + seta direita (SEM linha) ▶      ◀
  if (style === 'arrows-only') {
    return (
      <div style={containerStyle}>
        <ArrowRight />
        <div style={{ flex: 1 }} />
        <ArrowLeft />
      </div>
    )
  }

  // Estilo 7: Somente linha ━━━━━━━
  if (style === 'line-only') {
    return (
      <div style={{ ...containerStyle, padding: '0 15px' }}>
        <Line />
      </div>
    )
  }

  // Fallback - linha simples
  return (
    <div style={{ ...containerStyle, padding: '0 15px' }}>
      <Line />
    </div>
  )
}

// Cores disponíveis para formatação
const TEXT_COLORS = [
  { color: '#ffffff', name: 'Branco' },
  { color: '#ff453a', name: 'Vermelho' },
  { color: '#ff9f0a', name: 'Laranja' },
  { color: '#ffd60a', name: 'Amarelo' },
  { color: '#30d158', name: 'Verde' },
  { color: '#0a84ff', name: 'Azul' },
  { color: '#bf5af2', name: 'Roxo' },
  { color: '#ff375f', name: 'Rosa' },
]

const HIGHLIGHT_COLORS = [
  { color: 'transparent', name: 'Nenhum' },
  { color: '#ff453a40', name: 'Vermelho' },
  { color: '#ff9f0a40', name: 'Laranja' },
  { color: '#ffd60a40', name: 'Amarelo' },
  { color: '#30d15840', name: 'Verde' },
  { color: '#0a84ff40', name: 'Azul' },
  { color: '#bf5af240', name: 'Roxo' },
  { color: '#ff375f40', name: 'Rosa' },
]

// Interface para props da toolbar
interface FormattingToolbarProps {
  onFormat: (command: string, value?: string) => void
  onCuePointNav: (direction: 'prev' | 'next') => void
  cuePointCount: number
}

// Componente Toolbar de Formatação
function FormattingToolbar({ onFormat, onCuePointNav, cuePointCount }: FormattingToolbarProps) {
  const [showTextColor, setShowTextColor] = useState(false)
  const [showHighlight, setShowHighlight] = useState(false)

  return (
    <div className="formatting-toolbar">
      {/* Grupo: Estilo de texto */}
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={() => onFormat('bold')}
          title="Negrito (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button
          className="toolbar-btn"
          onClick={() => onFormat('italic')}
          title="Itálico (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button
          className="toolbar-btn"
          onClick={() => onFormat('underline')}
          title="Sublinhado (Ctrl+U)"
        >
          <Underline size={16} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Grupo: Cores */}
      <div className="toolbar-group">
        <div className="toolbar-dropdown">
          <button
            className="toolbar-btn"
            onClick={() => { setShowTextColor(!showTextColor); setShowHighlight(false) }}
            title="Cor do texto"
          >
            <Palette size={16} />
          </button>
          {showTextColor && (
            <div className="toolbar-dropdown-menu">
              <div className="color-grid">
                {TEXT_COLORS.map(c => (
                  <button
                    key={c.color}
                    className="color-btn"
                    style={{ background: c.color }}
                    onClick={() => { onFormat('foreColor', c.color); setShowTextColor(false) }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="toolbar-dropdown">
          <button
            className="toolbar-btn"
            onClick={() => { setShowHighlight(!showHighlight); setShowTextColor(false) }}
            title="Cor de destaque"
          >
            <Highlighter size={16} />
          </button>
          {showHighlight && (
            <div className="toolbar-dropdown-menu">
              <div className="color-grid">
                {HIGHLIGHT_COLORS.map(c => (
                  <button
                    key={c.color}
                    className="color-btn"
                    style={{ background: c.color === 'transparent' ? '#333' : c.color, border: c.color === 'transparent' ? '2px dashed #666' : 'none' }}
                    onClick={() => { onFormat('hiliteColor', c.color); setShowHighlight(false) }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="toolbar-divider" />

      {/* Grupo: Alinhamento */}
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={() => onFormat('justifyLeft')}
          title="Alinhar à esquerda"
        >
          <AlignLeft size={16} />
        </button>
        <button
          className="toolbar-btn"
          onClick={() => onFormat('justifyCenter')}
          title="Centralizar"
        >
          <AlignCenter size={16} />
        </button>
        <button
          className="toolbar-btn"
          onClick={() => onFormat('justifyRight')}
          title="Alinhar à direita"
        >
          <AlignRight size={16} />
        </button>
        <button
          className="toolbar-btn"
          onClick={() => onFormat('justifyFull')}
          title="Justificar"
        >
          <AlignJustify size={16} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Grupo: Limpar formatação */}
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={() => onFormat('removeFormat')}
          title="Limpar formatação"
        >
          <RemoveFormatting size={16} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Grupo: Cue Points */}
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={() => onFormat('insertCuePoint')}
          title="Inserir Cue Point (>>>)"
        >
          <MapPin size={16} />
        </button>
        <button
          className="toolbar-btn"
          onClick={() => onCuePointNav('prev')}
          title="Cue Point anterior"
          disabled={cuePointCount === 0}
        >
          <SkipBack size={16} />
        </button>
        <span className="cue-count" title="Cue Points no script">
          {cuePointCount}
        </span>
        <button
          className="toolbar-btn"
          onClick={() => onCuePointNav('next')}
          title="Próximo Cue Point"
          disabled={cuePointCount === 0}
        >
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  )
}

// Componente TitleBar - Estilo macOS
function TitleBar() {
  return (
    <div className="titlebar">
      <div className="titlebar-controls">
        <button 
          className="titlebar-btn close"
          onClick={() => window.electronAPI?.closeWindow()}
          title="Fechar"
        />
        <button 
          className="titlebar-btn minimize"
          onClick={() => window.electronAPI?.minimizeWindow()}
          title="Minimizar"
        />
        <button 
          className="titlebar-btn maximize"
          onClick={() => window.electronAPI?.maximizeWindow()}
          title="Maximizar"
        />
      </div>
      <div className="titlebar-logo">
        <FileText size={14} />
        <span>TelePrompterBrasil</span>
      </div>
    </div>
  )
}

// Componente Principal
function App() {
  // Estados
  const [scripts, setScripts] = useState<Script[]>([
    {
      id: '1',
      name: 'Bem-vindo',
      content: `Bem-vindo ao TelePrompterBrasil!

Este é o seu novo teleprompter profissional.

>>>

SEÇÃO 1: CONTROLES BÁSICOS

Você pode controlar o texto de duas formas:

AUTOMÁTICO - Aperte Play e o texto rola sozinho.
Ajuste a velocidade com o slider.

MANUAL - Use o scroll do mouse ou touchpad
para avançar ou voltar o texto.

>>>

SEÇÃO 2: FUNCIONALIDADES

Controles disponíveis:
• Play/Pause - Inicia rolagem automática
• Slider - Ajusta velocidade
• Fonte - Aumenta ou diminui texto
• Espelhar - Inverte horizontalmente
• Tela cheia - Modo apresentação

>>>

SEÇÃO 3: ATALHOS DE TECLADO

• Espaço → Play/Pause
• ↑ ↓ → Velocidade +/-
• Scroll Mouse → Avançar/Voltar
• R → Resetar posição
• M → Espelhar texto
• F → Tela cheia
• E → Editar script

>>>

SEÇÃO 4: CUE POINTS

Os >>> que você vê são CUE POINTS!
Use os botões ⏮️ ⏭️ na barra de controles
para pular entre as seções.

Ou clique diretamente nos badges ▶ CUE
para ir direto para aquela seção!

Boa gravação!`,
      createdAt: new Date()
    }
  ])
  
  const [activeScriptId, setActiveScriptId] = useState<string>('1')
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(2)
  const [fontSize, setFontSize] = useState(48)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isMirrored, setIsMirrored] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [editName, setEditName] = useState('')
  const [elapsedTime, setElapsedTime] = useState(0)
  const [currentCueIndex, setCurrentCueIndex] = useState(-1)
  const [showSettings, setShowSettings] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [textHeight, setTextHeight] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  
  // Cue Indicator Settings
  const [cueEnabled, setCueEnabled] = useState(true)
  const [cueStyle, setCueStyle] = useState<CueStyleType>('full')
  const [cuePosition, setCuePosition] = useState(38) // % do topo
  const [cueColor, setCueColor] = useState('#30d158') // Verde padrão
  const [cueOpacity, setCueOpacity] = useState(100) // 0-100
  const [cueThickness, setCueThickness] = useState(2) // px

  // Refs
  const textRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const timerRef = useRef<NodeJS.Timeout>()

  // Script ativo
  const activeScript = scripts.find(s => s.id === activeScriptId)

  // Calcular progresso
  const maxScroll = Math.max(0, textHeight - containerHeight * 0.4)
  const progress = maxScroll > 0 ? Math.min(100, (scrollPosition / maxScroll) * 100) : 0

  // Medir alturas
  useEffect(() => {
    const measureHeights = () => {
      if (textRef.current) {
        setTextHeight(textRef.current.scrollHeight)
      }
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }
    
    measureHeights()
    
    // Remedir quando a janela redimensionar
    window.addEventListener('resize', measureHeights)
    return () => window.removeEventListener('resize', measureHeights)
  }, [activeScript?.content, fontSize])

  // Timer separado - conta o tempo enquanto está rodando
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying])

  // Auto-scroll separado
  useEffect(() => {
    if (isPlaying) {
      const scrollSpeed = speed * 0.8

      const animate = () => {
        setScrollPosition(prev => {
          const next = prev + scrollSpeed
          if (next >= maxScroll) {
            setIsPlaying(false)
            return maxScroll
          }
          return next
        })
        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, speed, maxScroll])

  // Scroll manual com mouse wheel e touchpad
  useEffect(() => {
    const container = containerRef.current
    if (!container || isEditing) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      // deltaY positivo = scroll para baixo, negativo = scroll para cima
      const scrollAmount = e.deltaY * 0.5
      
      setScrollPosition(prev => {
        const next = prev + scrollAmount
        // Limitar entre 0 e maxScroll
        return Math.max(0, Math.min(maxScroll, next))
      })
    }

    // Adicionar listener com passive: false para poder usar preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [maxScroll, isEditing])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing && e.code !== 'Escape') return

      switch (e.code) {
        case 'Space':
          if (!isEditing) {
            e.preventDefault()
            setIsPlaying(prev => !prev)
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          setSpeed(prev => Math.min(10, prev + 0.5))
          break
        case 'ArrowDown':
          e.preventDefault()
          setSpeed(prev => Math.max(0.5, prev - 0.5))
          break
        case 'KeyR':
          if (!isEditing) {
            e.preventDefault()
            handleReset()
          }
          break
        case 'KeyM':
          if (!isEditing) {
            e.preventDefault()
            setIsMirrored(prev => !prev)
          }
          break
        case 'KeyE':
          e.preventDefault()
          if (isEditing) {
            handleSaveEdit()
          } else {
            handleStartEdit()
          }
          break
        case 'KeyF':
          if (!isEditing) {
            e.preventDefault()
            setIsFullscreen(prev => !prev)
          }
          break
        case 'Escape':
          if (isEditing) {
            setIsEditing(false)
          } else if (showSettings) {
            setShowSettings(false)
          } else if (isFullscreen) {
            setIsFullscreen(false)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditing, showSettings, isFullscreen])

  // Funções
  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setScrollPosition(0)
    setElapsedTime(0)
  }, [])

  const handleNewScript = () => {
    const newScript: Script = {
      id: Date.now().toString(),
      name: `Script ${scripts.length + 1}`,
      content: '',
      createdAt: new Date()
    }
    setScripts(prev => [...prev, newScript])
    setActiveScriptId(newScript.id)
    setEditName(newScript.name)
    setEditContent('')
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (activeScript) {
      setScripts(prev => prev.map(s => 
        s.id === activeScriptId 
          ? { ...s, content: editContent, name: editName || s.name }
          : s
      ))
    }
    setIsEditing(false)
    handleReset()
  }

  const handleStartEdit = () => {
    setEditContent(activeScript?.content || '')
    setEditName(activeScript?.name || '')
    setIsEditing(true)
  }

  const handleDeleteScript = (id: string) => {
    if (scripts.length <= 1) return
    setScripts(prev => prev.filter(s => s.id !== id))
    if (activeScriptId === id) {
      const remaining = scripts.filter(s => s.id !== id)
      setActiveScriptId(remaining[0].id)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Contar e encontrar posições dos Cue Points (baseado em proporção do texto)
  const cuePointData = (() => {
    const content = activeScript?.content || ''
    const textOnly = content.replace(/<[^>]*>/g, '') // Remove HTML
    const totalLength = textOnly.length
    const positions: number[] = []
    const regex = />>>/g
    let match
    
    while ((match = regex.exec(textOnly)) !== null) {
      // Guardar a proporção (0-1) de onde está o cue point no texto
      const proportion = match.index / Math.max(totalLength, 1)
      positions.push(proportion)
    }
    
    return { count: positions.length, positions }
  })()

  const cuePointCount = cuePointData.count

  // Função de formatação do editor rico
  const handleFormat = useCallback((command: string, value?: string) => {
    if (command === 'insertCuePoint') {
      document.execCommand('insertText', false, '>>>')
      if (editorRef.current) {
        setEditContent(editorRef.current.innerHTML)
      }
      return
    }

    document.execCommand(command, false, value)
    
    if (editorRef.current) {
      setEditContent(editorRef.current.innerHTML)
    }
  }, [])

  // Navegação entre Cue Points - SIMPLES E FUNCIONAL
  const handleCuePointNav = useCallback((direction: 'prev' | 'next') => {
    if (cuePointCount === 0) return
    
    let newIndex: number
    
    if (direction === 'next') {
      newIndex = currentCueIndex < cuePointCount - 1 ? currentCueIndex + 1 : 0
    } else {
      newIndex = currentCueIndex > 0 ? currentCueIndex - 1 : cuePointCount - 1
    }
    
    setCurrentCueIndex(newIndex)
    
    // Calcular posição de scroll baseado na proporção
    const proportion = cuePointData.positions[newIndex] || 0
    const newScrollPos = Math.max(0, proportion * maxScroll)
    
    setScrollPosition(newScrollPos)
    setIsPlaying(false) // Pausar ao navegar
  }, [currentCueIndex, cuePointCount, cuePointData.positions, maxScroll])

  // Pular para cue point específico (quando clica no badge)
  const jumpToCuePoint = useCallback((index: number) => {
    if (index < 0 || index >= cuePointCount) return
    
    setCurrentCueIndex(index)
    
    const proportion = cuePointData.positions[index] || 0
    const newScrollPos = Math.max(0, proportion * maxScroll)
    
    setScrollPosition(newScrollPos)
    setIsPlaying(false)
  }, [cuePointCount, cuePointData.positions, maxScroll])

  // Processar conteúdo para exibição no teleprompter
  const processContentForDisplay = useCallback((content: string) => {
    let index = 0
    return content.replace(
      /(&gt;&gt;&gt;|>>>)/g, 
      () => {
        const currentIndex = index++
        return `<span class="cue-point-marker" data-cue-index="${currentIndex}">▶ CUE ${currentIndex + 1}</span>`
      }
    )
  }, [])

  const handleSaveFile = async () => {
    if (!activeScript || !window.electronAPI) return
    await window.electronAPI.saveFile(activeScript.content, `${activeScript.name}.txt`)
  }

  const handleOpenFile = async () => {
    if (!window.electronAPI) return
    const result = await window.electronAPI.openFile()
    if (result.success && result.content) {
      const newScript: Script = {
        id: Date.now().toString(),
        name: result.path?.split(/[\\/]/).pop()?.replace('.txt', '') || 'Importado',
        content: result.content,
        createdAt: new Date()
      }
      setScripts(prev => [...prev, newScript])
      setActiveScriptId(newScript.id)
      handleReset()
    }
  }

  return (
    <div className={`app ${isFullscreen ? 'fullscreen' : ''}`}>
      <TitleBar />
      
      <div className="app-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <div className="sidebar-brand-icon">
                <FileText size={18} />
              </div>
              {!sidebarCollapsed && (
                <div className="sidebar-brand-text">
                  <h1>TelePrompter</h1>
                  <span>Brasil</span>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar-actions">
                <button className="btn btn-ghost btn-icon" onClick={handleOpenFile} title="Importar">
                  <FolderOpen size={16} />
                </button>
                <button className="btn btn-primary btn-icon" onClick={handleNewScript} title="Novo Script">
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <>
              <div className="sidebar-section-title">Scripts</div>
              <div className="sidebar-content">
                <div className="script-list">
                  {scripts.map(script => (
                    <div
                      key={script.id}
                      className={`script-item ${script.id === activeScriptId ? 'active' : ''}`}
                      onClick={() => {
                        setActiveScriptId(script.id)
                        setIsEditing(false)
                        handleReset()
                      }}
                    >
                      <div className="script-item-icon">
                        <FileText size={14} />
                      </div>
                      <span className="script-item-text">{script.name}</span>
                      {scripts.length > 1 && (
                        <button
                          className="script-item-delete"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteScript(script.id)
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="sidebar-footer">
            <button 
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => setShowSettings(true)}
            >
              <Settings size={16} />
              {!sidebarCollapsed && 'Configurações'}
            </button>
          </div>
        </aside>

        {/* Collapse Toggle - Esconde em fullscreen */}
        {!isFullscreen && (
          <button
            className="control-btn sidebar-toggle"
            style={{
              position: 'absolute',
              left: sidebarCollapsed ? 52 : 252,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 60,
              width: 24,
              height: 48,
              borderRadius: '0 8px 8px 0'
            }}
            onClick={() => setSidebarCollapsed(prev => !prev)}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        {/* Main Content */}
        <main className="main-content">
          {isEditing ? (
            // Editor Mode - Rich Text
            <div className="editor-container animate-fadeIn">
              <div className="editor-header">
                <div className="editor-title">
                  <Edit3 size={18} style={{ color: 'var(--accent-primary)' }} />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nome do script..."
                  />
                </div>
                <div className="editor-actions">
                  <button className="btn btn-secondary" onClick={handleSaveFile}>
                    <Save size={14} />
                    Exportar
                  </button>
                  <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveEdit}>
                    <Eye size={14} />
                    Visualizar
                  </button>
                </div>
              </div>
              
              {/* Toolbar de Formatação */}
              <FormattingToolbar 
                onFormat={handleFormat}
                onCuePointNav={handleCuePointNav}
                cuePointCount={cuePointCount}
              />
              
              {/* Editor Rico - ContentEditable */}
              <div
                ref={editorRef}
                className="editor-textarea rich-editor"
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setEditContent((e.target as HTMLDivElement).innerHTML)}
                onKeyDown={(e) => {
                  // Atalhos de formatação
                  if (e.ctrlKey || e.metaKey) {
                    switch (e.key.toLowerCase()) {
                      case 'b':
                        e.preventDefault()
                        handleFormat('bold')
                        break
                      case 'i':
                        e.preventDefault()
                        handleFormat('italic')
                        break
                      case 'u':
                        e.preventDefault()
                        handleFormat('underline')
                        break
                    }
                  }
                }}
                dangerouslySetInnerHTML={{ __html: editContent || '' }}
                data-placeholder="Digite ou cole seu script aqui..."
              />
              
              <div className="editor-footer">
                <span className="char-count">
                  {(editorRef.current?.innerText || editContent).length} caracteres · {(editorRef.current?.innerText || editContent).split(/\s+/).filter(Boolean).length} palavras
                </span>
                {cuePointCount > 0 && (
                  <span className="cue-count-footer">
                    <MapPin size={12} /> {cuePointCount} Cue Points
                  </span>
                )}
              </div>
            </div>
          ) : (
            // Teleprompter Mode
            <div className="teleprompter-wrapper">
              <div className="teleprompter-display" ref={containerRef}>
                {/* Fade superior */}
                <div className="prompter-fade top" />
                
                {/* Cue Indicator - 7 estilos disponíveis */}
                {cueEnabled && (
                  <CueIndicator
                    style={cueStyle}
                    position={cuePosition}
                    color={cueColor}
                    opacity={cueOpacity}
                    thickness={cueThickness}
                  />
                )}
                
                {/* Viewport do texto */}
                <div className="prompter-viewport">
                  <motion.div
                    className="prompter-content"
                    style={{ 
                      y: -scrollPosition + (containerHeight * 0.35)
                    }}
                  >
                    <div 
                      ref={textRef}
                      className={`prompter-text ${isMirrored ? 'mirrored' : ''}`}
                      style={{ fontSize: `${fontSize}px` }}
                      onClick={(e) => {
                        // Clique em Cue Point para pular
                        const target = e.target as HTMLElement
                        if (target.classList.contains('cue-point-marker')) {
                          const cueIndex = parseInt(target.getAttribute('data-cue-index') || '0')
                          jumpToCuePoint(cueIndex)
                        }
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: processContentForDisplay(activeScript?.content || '<span style="opacity: 0.5">Clique em um script para começar</span>') 
                      }}
                    />
                  </motion.div>
                </div>

                {/* Fade inferior */}
                <div className="prompter-fade bottom" />
                
                {/* Barra de progresso */}
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="controls-bar">
            {/* Esquerda - Timer e ações */}
            <div className="controls-section left">
              <div className="timer-display">
                <Clock size={14} style={{ color: 'var(--text-tertiary)' }} />
                <span className="timer-value">{formatTime(elapsedTime)}</span>
              </div>
              
              <button 
                className="control-btn"
                onClick={handleStartEdit}
                data-tooltip="Editar (E)"
              >
                <Edit3 size={18} />
              </button>

              <button 
                className={`control-btn ${isMirrored ? 'active' : ''}`}
                onClick={() => setIsMirrored(prev => !prev)}
                data-tooltip="Espelhar (M)"
              >
                <FlipHorizontal size={18} />
              </button>
            </div>

            {/* Centro - Controles principais */}
            <div className="controls-section center">
              <button 
                className="control-btn"
                onClick={handleReset}
                data-tooltip="Resetar (R)"
              >
                <RotateCcw size={18} />
              </button>

              <button 
                className={`play-button ${isPlaying ? 'playing' : ''}`}
                onClick={() => setIsPlaying(prev => !prev)}
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 3 }} />}
              </button>

              <div className="speed-control">
                <span className="speed-label">Velocidade</span>
                <input
                  type="range"
                  className="speed-slider"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                />
                <span className="speed-value">{speed.toFixed(1)}x</span>
              </div>
            </div>

            {/* Cue Points - Navegação */}
            {cuePointCount > 0 && (
              <div className="controls-section cue-nav">
                <button 
                  className="control-btn"
                  onClick={() => handleCuePointNav('prev')}
                  data-tooltip="Cue anterior"
                >
                  <SkipBack size={18} />
                </button>
                <div className="cue-indicator-badge">
                  <MapPin size={14} />
                  <span>{currentCueIndex + 1}/{cuePointCount}</span>
                </div>
                <button 
                  className="control-btn"
                  onClick={() => handleCuePointNav('next')}
                  data-tooltip="Próximo Cue"
                >
                  <SkipForward size={18} />
                </button>
              </div>
            )}

            {/* Direita - Fonte e fullscreen */}
            <div className="controls-section right">
              <div className="font-control">
                <button 
                  className="font-btn"
                  onClick={() => setFontSize(prev => Math.max(24, prev - 4))}
                >
                  <Type size={12} />
                </button>
                <span className="font-value">{fontSize}</span>
                <button 
                  className="font-btn"
                  onClick={() => setFontSize(prev => Math.min(96, prev + 4))}
                >
                  <Type size={18} />
                </button>
              </div>

              <button 
                className="control-btn"
                onClick={() => setIsFullscreen(prev => !prev)}
                data-tooltip="Tela cheia (F)"
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
        </main>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              className="settings-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                className="settings-panel animate-scaleIn"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="settings-header">
                  <h2>Configurações</h2>
                  <button 
                    className="btn btn-ghost btn-icon"
                    onClick={() => setShowSettings(false)}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="settings-content">
                  <div className="settings-section">
                    <div className="settings-section-title">Aparência</div>
                    
                    <div className="settings-row">
                      <span className="settings-label">Espelhar texto</span>
                      <div 
                        className={`toggle ${isMirrored ? 'active' : ''}`}
                        onClick={() => setIsMirrored(prev => !prev)}
                      >
                        <div className="toggle-knob" />
                      </div>
                    </div>

                    <div className="settings-row">
                      <span className="settings-label">Tamanho da fonte</span>
                      <span className="settings-value">{fontSize}px</span>
                    </div>

                    <div className="settings-row">
                      <span className="settings-label">Velocidade</span>
                      <span className="settings-value">{speed.toFixed(1)}x</span>
                    </div>
                  </div>

                  {/* Cue Indicator Settings */}
                  <div className="settings-section">
                    <div className="settings-section-title">Indicador Cue</div>
                    
                    <div className="settings-row">
                      <span className="settings-label">Mostrar indicador</span>
                      <div 
                        className={`toggle ${cueEnabled ? 'active' : ''}`}
                        onClick={() => setCueEnabled(prev => !prev)}
                      >
                        <div className="toggle-knob" />
                      </div>
                    </div>

                    {cueEnabled && (
                      <>
                        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
                          <span className="settings-label">Estilo do indicador</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {[
                              { id: 'arrow-left' as CueStyleType, label: '1. Seta esquerda', icon: '▶' },
                              { id: 'arrow-left-line' as CueStyleType, label: '2. Seta esquerda + linha', icon: '▶━━━' },
                              { id: 'full' as CueStyleType, label: '3. Completo', icon: '▶━━◀' },
                              { id: 'line-arrow-right' as CueStyleType, label: '4. Linha + seta direita', icon: '━━━◀' },
                              { id: 'arrow-right' as CueStyleType, label: '5. Seta direita', icon: '◀' },
                              { id: 'arrows-only' as CueStyleType, label: '6. Setas (sem linha)', icon: '▶  ◀' },
                              { id: 'line-only' as CueStyleType, label: '7. Linha', icon: '━━━━' },
                            ].map(s => (
                              <button
                                key={s.id}
                                className={`btn ${cueStyle === s.id ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setCueStyle(s.id)}
                                style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  padding: '10px 14px',
                                  fontSize: 13,
                                }}
                              >
                                <span>{s.label}</span>
                                <span style={{ 
                                  fontFamily: 'monospace', 
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: cueStyle === s.id ? 'white' : 'var(--accent-primary)',
                                }}>{s.icon}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="settings-label">Posição vertical</span>
                            <span className="settings-value">{cuePosition}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="80"
                            value={cuePosition}
                            onChange={(e) => setCuePosition(parseInt(e.target.value))}
                            className="speed-slider"
                            style={{ width: '100%' }}
                          />
                        </div>

                        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="settings-label">Opacidade</span>
                            <span className="settings-value">{cueOpacity}%</span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="100"
                            value={cueOpacity}
                            onChange={(e) => setCueOpacity(parseInt(e.target.value))}
                            className="speed-slider"
                            style={{ width: '100%' }}
                          />
                        </div>

                        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="settings-label">Espessura</span>
                            <span className="settings-value">{cueThickness}px</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="6"
                            value={cueThickness}
                            onChange={(e) => setCueThickness(parseInt(e.target.value))}
                            className="speed-slider"
                            style={{ width: '100%' }}
                          />
                        </div>

                        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                          <span className="settings-label">Cor</span>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {[
                              { color: '#30d158', name: 'Verde' },
                              { color: '#0a84ff', name: 'Azul' },
                              { color: '#ff453a', name: 'Vermelho' },
                              { color: '#ff9f0a', name: 'Laranja' },
                              { color: '#ffd60a', name: 'Amarelo' },
                              { color: '#bf5af2', name: 'Roxo' },
                              { color: '#ff375f', name: 'Rosa' },
                              { color: '#ffffff', name: 'Branco' },
                            ].map(c => (
                              <button
                                key={c.color}
                                onClick={() => setCueColor(c.color)}
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: '50%',
                                  background: c.color,
                                  border: cueColor === c.color ? '3px solid white' : '2px solid transparent',
                                  cursor: 'pointer',
                                  boxShadow: cueColor === c.color ? `0 0 10px ${c.color}` : 'none',
                                }}
                                title={c.name}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="settings-section">
                    <div className="settings-section-title">Controles</div>
                    
                    <div className="settings-row">
                      <span className="settings-label">Scroll manual</span>
                      <span className="settings-value">Mouse / Touchpad</span>
                    </div>
                    <div className="settings-row">
                      <span className="settings-label">Play / Pause</span>
                      <span className="settings-value">Espaço</span>
                    </div>
                    <div className="settings-row">
                      <span className="settings-label">Velocidade +</span>
                      <span className="settings-value">↑</span>
                    </div>
                    <div className="settings-row">
                      <span className="settings-label">Velocidade -</span>
                      <span className="settings-value">↓</span>
                    </div>
                    <div className="settings-row">
                      <span className="settings-label">Resetar posição</span>
                      <span className="settings-value">R</span>
                    </div>
                    <div className="settings-row">
                      <span className="settings-label">Espelhar texto</span>
                      <span className="settings-value">M</span>
                    </div>
                    <div className="settings-row">
                      <span className="settings-label">Editar script</span>
                      <span className="settings-value">E</span>
                    </div>
                    <div className="settings-row">
                      <span className="settings-label">Tela cheia</span>
                      <span className="settings-value">F</span>
                    </div>
                    <div className="settings-row">
                      <span className="settings-label">Voltar / Fechar</span>
                      <span className="settings-value">Esc</span>
                    </div>
                  </div>

                  <div className="settings-section">
                    <div className="settings-section-title">Sobre</div>
                    <div className="settings-row">
                      <span className="settings-label">Versão</span>
                      <span className="settings-value">1.0.0</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
