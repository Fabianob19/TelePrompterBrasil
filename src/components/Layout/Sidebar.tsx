
import {
    FileText,
    FolderOpen,
    Plus,
    Trash2,
    Settings,
    ChevronRight,
    ChevronLeft
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

interface SidebarProps {
    onOpenSettings: () => void
}

// Sidebar Component
export function Sidebar({ onOpenSettings }: SidebarProps) {
    // Select only what we need to minimize re-renders
    const scripts = useAppStore(state => state.scripts)
    const activeScriptId = useAppStore(state => state.activeScriptId)
    const collapsed = useAppStore(state => state.settings.sidebarCollapsed)

    const setActiveScriptId = useAppStore(state => state.setActiveScriptId)
    const addScript = useAppStore(state => state.addScript)
    const deleteScript = useAppStore(state => state.deleteScript)
    const updateSettings = useAppStore(state => state.updateSettings)

    // Handlers
    const handleOpenFile = async () => {
        if (!window.electronAPI) return

        try {
            const result = await window.electronAPI.openFile()
            if (result.success && result.content) {
                // Create new script from file
                const name = result.path ? result.path.split(/[\\/]/).pop()?.replace('.txt', '') : 'Novo Script'

                useAppStore.setState(state => {
                    const newScript = {
                        id: Date.now().toString(),
                        name: name || 'Importado',
                        content: result.content || '',
                        createdAt: new Date()
                    }
                    return {
                        scripts: [...state.scripts, newScript],
                        activeScriptId: newScript.id
                    }
                })
            }
        } catch (error) {
            console.error('Falha ao abrir arquivo:', error)
        }
    }

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <FileText size={18} />
                    </div>
                    {!collapsed && (
                        <div className="sidebar-brand-text">
                            <h1>TelePrompter</h1>
                            {/* <span>Pro</span> */}
                        </div>
                    )}
                </div>
                {!collapsed && (
                    <div className="sidebar-actions">
                        <button className="btn btn-ghost btn-icon" onClick={handleOpenFile} title="Importar">
                            <FolderOpen size={16} />
                        </button>
                        <button className="btn btn-primary btn-icon" onClick={addScript} title="Novo Script">
                            <Plus size={16} />
                        </button>
                    </div>
                )}
            </div>

            {!collapsed && (
                <>
                    <div className="sidebar-section-title">Scripts</div>
                    <div className="sidebar-content">
                        <div className="script-list">
                            {scripts.map(script => (
                                <div
                                    key={script.id}
                                    className={`script-item ${script.id === activeScriptId ? 'active' : ''}`}
                                    onClick={() => setActiveScriptId(script.id)}
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
                                                deleteScript(script.id)
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
                    onClick={onOpenSettings}
                >
                    <Settings size={16} />
                    {!collapsed && 'Configurações'}
                </button>
            </div>

            {/* Collapse Toggle - Moved INSIDE aside for relative positioning */}
            <button
                className="control-btn sidebar-toggle"
                title={collapsed ? "Expandir" : "Recolher"}
                style={{
                    position: 'absolute',
                    right: -12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 60,
                    width: 24,
                    height: 48,
                    borderRadius: '0 8px 8px 0',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderLeft: 'none',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
                onClick={() => updateSettings({ sidebarCollapsed: !collapsed })}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </aside>
    )
}
