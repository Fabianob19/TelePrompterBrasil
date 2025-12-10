
import { useState } from 'react'
import {
    Bold, Italic, Underline, Palette, Highlighter,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    RemoveFormatting, MapPin, SkipBack, SkipForward
} from 'lucide-react'

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

interface FormattingToolbarProps {
    onFormat: (command: string, value?: string) => void
    onCuePointNav: (direction: 'prev' | 'next') => void
    onSmartCaps: () => void
    cuePointCount: number
}

export function FormattingToolbar({ onFormat, onCuePointNav, onSmartCaps, cuePointCount }: FormattingToolbarProps) {
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

            <div className="toolbar-group">
                <button
                    className="toolbar-btn"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={onSmartCaps}
                    title="Transformar em MAIÚSCULAS"
                    style={{ fontWeight: 800, fontSize: '14px' }}
                >
                    TT
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
