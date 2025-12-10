
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { CueStyleType } from '../../types'

interface SettingsPanelProps {
    isOpen: boolean
    onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
    const settings = useAppStore(state => state.settings)
    const updateSettings = useAppStore(state => state.updateSettings)

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="settings-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
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
                                onClick={onClose}
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
                                        className={`toggle ${settings.isMirrored ? 'active' : ''}`}
                                        onClick={() => updateSettings({ isMirrored: !settings.isMirrored })}
                                    >
                                        <div className="toggle-knob" />
                                    </div>
                                </div>

                                <div className="settings-row">
                                    <span className="settings-label">Tamanho da fonte</span>
                                    <span className="settings-value">{settings.fontSize}px</span>
                                </div>
                            </div>

                            {/* External Display Section */}
                            <div className="settings-section">
                                <div className="settings-section-title">Tela Externa</div>
                                <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => window.electronAPI.createExternalWindow()}
                                        style={{ width: '100%', justifyContent: 'center' }}
                                    >
                                        Abrir Janela HDMI
                                    </button>
                                    <p style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
                                        A janela abrirá automaticamente no segundo monitor, se disponível.
                                    </p>
                                </div>
                            </div>

                            {/* Cue Indicator Settings */}
                            <div className="settings-section">
                                <div className="settings-section-title">Indicador Cue</div>

                                <div className="settings-row">
                                    <span className="settings-label">Mostrar indicador</span>
                                    <div
                                        className={`toggle ${settings.cueEnabled ? 'active' : ''}`}
                                        onClick={() => updateSettings({ cueEnabled: !settings.cueEnabled })}
                                    >
                                        <div className="toggle-knob" />
                                    </div>
                                </div>

                                {settings.cueEnabled && (
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
                                                        className={`btn ${settings.cueStyle === s.id ? 'btn-primary' : 'btn-secondary'}`}
                                                        onClick={() => updateSettings({ cueStyle: s.id })}
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
                                                            color: settings.cueStyle === s.id ? 'white' : 'var(--accent-primary)',
                                                        }}>{s.icon}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span className="settings-label">Posição vertical</span>
                                                <span className="settings-value">{settings.cuePosition}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="10"
                                                max="80"
                                                value={settings.cuePosition}
                                                onChange={(e) => updateSettings({ cuePosition: parseInt(e.target.value) })}
                                                className="speed-slider"
                                                style={{ width: '100%' }}
                                            />
                                        </div>

                                        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span className="settings-label">Opacidade</span>
                                                <span className="settings-value">{settings.cueOpacity}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="20"
                                                max="100"
                                                value={settings.cueOpacity}
                                                onChange={(e) => updateSettings({ cueOpacity: parseInt(e.target.value) })}
                                                className="speed-slider"
                                                style={{ width: '100%' }}
                                            />
                                        </div>

                                        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span className="settings-label">Espessura</span>
                                                <span className="settings-value">{settings.cueThickness}px</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="6"
                                                value={settings.cueThickness}
                                                onChange={(e) => updateSettings({ cueThickness: parseInt(e.target.value) })}
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
                                                        onClick={() => updateSettings({ cueColor: c.color })}
                                                        style={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: '50%',
                                                            background: c.color,
                                                            border: settings.cueColor === c.color ? '3px solid white' : '2px solid transparent',
                                                            cursor: 'pointer',
                                                            boxShadow: settings.cueColor === c.color ? `0 0 10px ${c.color}` : 'none',
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
                                <div className="settings-section-title">Sobre</div>
                                <div className="settings-row">
                                    <span className="settings-label">Versão</span>
                                    <span className="settings-value">1.1.0</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
