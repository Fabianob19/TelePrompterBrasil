
import {
    Play, Pause, RotateCcw, Edit3, FlipHorizontal,
    Type, Maximize, Minimize2, Clock, SkipBack, SkipForward
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

interface PlaybackControlsProps {
    onStartEdit: () => void
    isFullscreen: boolean
    onToggleFullscreen: () => void
}

export function PlaybackControls({ onStartEdit, isFullscreen, onToggleFullscreen }: PlaybackControlsProps) {
    const playback = useAppStore(state => state.playback)
    const settings = useAppStore(state => state.settings)

    const togglePlay = useAppStore(state => state.togglePlay)
    const updatePlayback = useAppStore(state => state.updatePlayback)
    const updateSettings = useAppStore(state => state.updateSettings)
    const resetPlayback = useAppStore(state => state.resetPlayback)
    const triggerCueAction = useAppStore(state => state.triggerCueAction)

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // Calculate remaining time based on scroll position and speed
    const calculateRemainingTime = (): number => {
        const { scrollPosition, speed, textHeight, containerHeight } = playback
        if (textHeight === 0 || containerHeight === 0 || speed === 0) return 0

        const maxScroll = Math.max(0, textHeight - containerHeight * 0.4)
        const remainingScroll = Math.max(0, maxScroll - scrollPosition)
        const pixelsPerSecond = speed * 0.8 * 60 // speed * multiplier * frames per second

        return remainingScroll / pixelsPerSecond
    }

    const remainingTime = calculateRemainingTime()

    return (
        <div className="controls-bar">
            {/* Esquerda - Timer e ações rápido */}
            <div className="controls-section left">
                <div className="timer-display">
                    <Clock size={14} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="timer-value" title="Tempo decorrido">
                        E: {formatTime(playback.elapsedTime)}
                    </span>
                    <span style={{ color: 'var(--text-quaternary)', margin: '0 4px' }}>|</span>
                    <span className="timer-value" style={{ color: 'var(--accent-primary)' }} title="Tempo restante">
                        R: {formatTime(remainingTime)}
                    </span>
                </div>

                <button
                    className="control-btn"
                    onClick={onStartEdit}
                    title="Editar Script (E)"
                >
                    <Edit3 size={18} />
                </button>

                <button
                    className={`control-btn ${settings.isMirrored ? 'active' : ''}`}
                    onClick={() => updateSettings({ isMirrored: !settings.isMirrored })}
                    title="Espelhar (M)"
                >
                    <FlipHorizontal size={18} />
                </button>
            </div>

            {/* Centro - Controles principais */}
            <div className="controls-section center">
                <button
                    className="control-btn"
                    onClick={resetPlayback}
                    title="Resetar (R)"
                >
                    <RotateCcw size={18} />
                </button>

                <div className="cue-controls" style={{ display: 'flex', gap: 4 }}>
                    <button
                        className="control-btn"
                        onClick={() => triggerCueAction('prev')}
                        title="Cue Anterior"
                    >
                        <SkipBack size={20} />
                    </button>
                    <button
                        className="control-btn"
                        onClick={() => triggerCueAction('next')}
                        title="Próximo Cue"
                    >
                        <SkipForward size={20} />
                    </button>
                </div>

                <button
                    className={`play-button ${playback.isPlaying ? 'playing' : ''}`}
                    onClick={togglePlay}
                >
                    {playback.isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 3 }} />}
                </button>

                <div className="speed-control">
                    {/* Toggle entre Manual e Timed */}
                    <button
                        className={`timed-toggle ${playback.timedMode ? 'active' : ''}`}
                        onClick={() => {
                            const newTimedMode = !playback.timedMode
                            if (newTimedMode) {
                                // Calcular velocidade para o tempo alvo
                                const { textHeight, containerHeight, targetDuration, scrollPosition } = playback
                                if (textHeight > 0 && containerHeight > 0 && targetDuration > 0) {
                                    const maxScroll = Math.max(0, textHeight - containerHeight * 0.4)
                                    const remainingScroll = Math.max(0, maxScroll - scrollPosition)
                                    // speed = remainingScroll / (targetDuration * 0.8 * 60)
                                    const calculatedSpeed = remainingScroll / (targetDuration * 0.8 * 60)
                                    const clampedSpeed = Math.max(0.5, Math.min(10, calculatedSpeed))
                                    updatePlayback({ timedMode: true, speed: clampedSpeed })
                                } else {
                                    updatePlayback({ timedMode: true })
                                }
                            } else {
                                updatePlayback({ timedMode: false })
                            }
                        }}
                        title={playback.timedMode ? 'Modo Temporizado (ativo)' : 'Modo Manual'}
                    >
                        ⏱️ {playback.timedMode ? 'TIMED' : 'MANUAL'}
                    </button>

                    {playback.timedMode ? (
                        /* Modo Timed: Input de tempo alvo */
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span className="speed-label">Tempo alvo</span>
                            <input
                                type="number"
                                min="30"
                                max="3600"
                                step="30"
                                value={playback.targetDuration}
                                onChange={(e) => {
                                    const newDuration = parseInt(e.target.value) || 180
                                    const { textHeight, containerHeight, scrollPosition } = playback
                                    if (textHeight > 0 && containerHeight > 0) {
                                        const maxScroll = Math.max(0, textHeight - containerHeight * 0.4)
                                        const remainingScroll = Math.max(0, maxScroll - scrollPosition)
                                        const calculatedSpeed = remainingScroll / (newDuration * 0.8 * 60)
                                        const clampedSpeed = Math.max(0.5, Math.min(10, calculatedSpeed))
                                        updatePlayback({ targetDuration: newDuration, speed: clampedSpeed })
                                    } else {
                                        updatePlayback({ targetDuration: newDuration })
                                    }
                                }}
                                style={{
                                    width: 60,
                                    padding: '4px 6px',
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border-primary)',
                                    borderRadius: 4,
                                    color: 'var(--text-primary)',
                                    fontSize: 12,
                                    textAlign: 'center'
                                }}
                            />
                            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                                ({formatTime(playback.targetDuration)})
                            </span>
                        </div>
                    ) : (
                        /* Modo Manual: Slider de velocidade */
                        <>
                            <span className="speed-label">Velocidade</span>
                            <input
                                type="range"
                                className="speed-slider"
                                min="0.5"
                                max="10"
                                step="0.5"
                                value={playback.speed}
                                onChange={(e) => updatePlayback({ speed: parseFloat(e.target.value) })}
                            />
                            <span className="speed-value">{playback.speed.toFixed(1)}x</span>
                        </>
                    )}
                </div>
            </div>

            {/* Direita - Fonte e fullscreen */}
            <div className="controls-section right">
                <div className="font-control">
                    <button
                        className="font-btn"
                        onClick={() => updateSettings({ fontSize: Math.max(24, settings.fontSize - 4) })}
                    >
                        <Type size={12} />
                    </button>
                    <span className="font-value">{settings.fontSize}</span>
                    <button
                        className="font-btn"
                        onClick={() => updateSettings({ fontSize: Math.min(96, settings.fontSize + 4) })}
                    >
                        <Type size={18} />
                    </button>
                </div>

                <button
                    className="control-btn"
                    onClick={onToggleFullscreen}
                    title="Tela cheia (F)"
                >
                    {isFullscreen ? <Minimize2 size={18} /> : <Maximize size={18} />}
                </button>
            </div>
        </div>
    )
}
