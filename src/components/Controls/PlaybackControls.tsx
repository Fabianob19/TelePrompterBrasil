
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
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="controls-bar">
            {/* Esquerda - Timer e ações rápido */}
            <div className="controls-section left">
                <div className="timer-display">
                    <Clock size={14} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="timer-value">{formatTime(playback.elapsedTime)}</span>
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
