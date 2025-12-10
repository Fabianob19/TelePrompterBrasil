
import { useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react'
import { Edit3, Save, Eye, MapPin } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { FormattingToolbar } from './FormattingToolbar'

interface RichEditorProps {
    onClose: () => void
}

export function RichEditor({ onClose }: RichEditorProps) {
    const activeScript = useAppStore(state => state.scripts.find(s => s.id === state.activeScriptId))
    const updateScript = useAppStore(state => state.updateScript)
    const activeScriptId = useAppStore(state => state.activeScriptId)

    // Local state
    const [editName, setEditName] = useState(activeScript?.name || '')
    const [editContent, setEditContent] = useState(activeScript?.content || '')
    const [saveStatus, setSaveStatus] = useState<string>('Salvo')
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const editorRef = useRef<HTMLDivElement>(null)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Sync when active script changes (Initial Load)
    useLayoutEffect(() => {
        if (activeScript) {
            // Só atualiza se for diferente para não resetar cursor se o script mudar externamente
            if (editorRef.current && editorRef.current.innerHTML !== activeScript.content) {
                editorRef.current.innerHTML = activeScript.content
            }
            // Carga inicial do state
            if (editName === '') setEditName(activeScript.name)
            if (editContent === '') setEditContent(activeScript.content)
        }
    }, [activeScript, activeScriptId])

    // Auto-Save Logic (Debounced)
    useEffect(() => {
        // Ignorar carga inicial sem ID
        if (!activeScriptId) return

        setSaveStatus('Editando...')

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

        saveTimeoutRef.current = setTimeout(() => {
            updateScript(activeScriptId, {
                name: editName,
                content: editContent
            })
            setSaveStatus('Salvo automático')
            setLastSaved(new Date())
        }, 2000) // 2 segundos de inatividade

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
        }
    }, [editName, editContent, activeScriptId, updateScript])

    // Count Cue Points
    const cuePointCount = (editContent.match(/>>>|&gt;&gt;&gt;/g) || []).length

    // Manual Save
    const handleSave = () => {
        if (activeScriptId) {
            updateScript(activeScriptId, {
                name: editName,
                content: editContent
            })
            setSaveStatus('Salvo')
            setLastSaved(new Date())
        }
        onClose()
    }

    const handleExport = async () => {
        if (!activeScript) return

        const blob = new Blob([activeScript.content], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${activeScript.name}.html`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleFormat = useCallback((command: string, value?: string) => {
        if (command === 'insertCuePoint') {
            document.execCommand('insertText', false, '>>>')
        } else {
            document.execCommand(command, false, value)
        }

        if (editorRef.current) {
            setEditContent(editorRef.current.innerHTML)
            editorRef.current.focus()
        }
    }, [])

    const handleCuePointNav = (direction: 'prev' | 'next') => {
        // Let's implement a simple "Find"
        const findNext = direction === 'next'

        // @ts-ignore
        const found = window.find('>>>', false, !findNext, true, false, false, false)
    }

    // 2.0 Feature: Smart Caps
    const handleSmartCaps = () => {
        const selection = window.getSelection()
        if (selection && !selection.isCollapsed) {
            // Transformar apenas a seleção
            document.execCommand('insertText', false, selection.toString().toUpperCase())
        } else {
            // Se não tem seleção, avisa ou faz nada? Proposta: Uppercase All via confirm
            if (window.confirm('Transformar TODO o texto em MAIÚSCULAS?')) {
                if (editorRef.current) {
                    const text = editorRef.current.innerText.toUpperCase()
                    editorRef.current.innerText = text
                    setEditContent(editorRef.current.innerHTML)
                }
            }
        }
        // Restore focus to editor
        if (editorRef.current) {
            editorRef.current.focus()
        }
    }

    // 2.0 Feature: Paste Sanitization
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
    }

    return (
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
                    <button className="btn btn-secondary" onClick={handleExport}>
                        <Save size={14} />
                        Exportar
                    </button>
                    <button className="btn btn-ghost" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        <Eye size={14} />
                        Visualizar
                    </button>
                </div>
            </div>

            <FormattingToolbar
                onFormat={handleFormat}
                onCuePointNav={handleCuePointNav}
                onSmartCaps={handleSmartCaps}
                cuePointCount={cuePointCount}
            />

            <div className="editor-workspace">
                <div className="editor-page-container">
                    <div
                        ref={editorRef}
                        className="editor-textarea rich-editor"
                        contentEditable
                        suppressContentEditableWarning
                        onPaste={handlePaste}
                        onInput={(e) => setEditContent((e.target as HTMLDivElement).innerHTML)}
                        onKeyDown={(e) => {
                            if (e.ctrlKey || e.metaKey) {
                                switch (e.key.toLowerCase()) {
                                    case 'b': e.preventDefault(); handleFormat('bold'); break
                                    case 'i': e.preventDefault(); handleFormat('italic'); break
                                    case 'u': e.preventDefault(); handleFormat('underline'); break
                                }
                            }
                        }}
                        data-placeholder="Digite ou cole seu script aqui..."
                    />
                </div>
            </div>

            <div className="editor-footer">
                <span className="char-count">
                    {editContent.replace(/<[^>]*>/g, '').length} caracteres
                </span>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        {saveStatus} {lastSaved && `às ${lastSaved.toLocaleTimeString()}`}
                    </span>
                    {cuePointCount > 0 && (
                        <span className="cue-count-footer">
                            <MapPin size={12} /> {cuePointCount} Cue Points
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
