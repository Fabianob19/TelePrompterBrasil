
import { useRef, useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { CueIndicator } from './CueIndicator'

interface TeleprompterDisplayProps {
    isExternal?: boolean
}

export function TeleprompterDisplay({ isExternal = false }: TeleprompterDisplayProps) {
    // Store Selection
    const activeScript = useAppStore(state => state.scripts.find(s => s.id === state.activeScriptId))
    const settings = useAppStore(state => state.settings)
    const playback = useAppStore(state => state.playback)

    const updatePlayback = useAppStore(state => state.updatePlayback)
    const togglePlay = useAppStore(state => state.togglePlay)

    // Refs for animation loop (avoiding re-renders)
    const scrollPosRef = useRef(playback.scrollPosition)
    const contentRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const animationFrameRef = useRef<number>()

    // Local state for layout measurements
    const [containerHeight, setContainerHeight] = useState(0)
    const [textHeight, setTextHeight] = useState(0)

    // Progress bar state
    const [progress, setProgress] = useState(0)

    // 1. Measure layout when content changes
    useEffect(() => {
        const measure = () => {
            if (containerRef.current) setContainerHeight(containerRef.current.clientHeight)
            if (textRef.current) setTextHeight(textRef.current.scrollHeight)
        }
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [activeScript?.content, settings.fontSize])

    // Listener for Cue Navigation
    useEffect(() => {
        // Slave Mode: Apenas o mestre calcula a navegação. A externa só recebe o novo scrollPosition.
        if (isExternal) return

        if (!playback.cueAction) return

        const cues = Array.from(document.querySelectorAll('.cue-point-marker')) as HTMLElement[]
        if (cues.length === 0) return


        const currentScroll = playback.scrollPosition

        // Calcular onde cada cue ESTARIA se estivesse na linha de leitura
        // O alvo é simplesmente a posição do cue no texto (ajustado para o centro). O offset visual é tratado no updateDOM.
        const cueScrollTargets = cues.map(cue => cue.offsetTop + cue.offsetHeight / 2)

        let targetY = -1

        if (playback.cueAction.type === 'next') {
            // Próximo: primeiro alvo que é MAIOR que o scroll atual (+ margem)
            const nextTarget = cueScrollTargets.find(t => t > currentScroll + 20)
            if (nextTarget !== undefined) {
                targetY = nextTarget
            } else {
                // Se não achou (estamos no fim), volta para o início se quiser Loop, ou fica quieto.
                // Vamos permitir loop para o primeiro se estivermos no fim?
                // Melhor: se não tem próximo, vai para o primeiro (0) apenas se já passamos do último
                if (currentScroll >= (cueScrollTargets[cueScrollTargets.length - 1] || 0)) {
                    targetY = cueScrollTargets[0]
                }
            }
        } else {
            // Anterior: primeiro alvo (invertido) que é MENOR que scroll atual (- margem)
            const prevTarget = [...cueScrollTargets].reverse().find(t => t < currentScroll - 20)
            if (prevTarget !== undefined) {
                targetY = prevTarget
            } else {
                // Se não achou (estamos no início), garante 0
                targetY = 0
            }
        }

        if (targetY !== -1) {
            updatePlayback({ scrollPosition: targetY })
        }

    }, [playback.cueAction])

    // 2. Sync Ref with Store when Store changes externally (e.g. reset)
    useEffect(() => {
        scrollPosRef.current = playback.scrollPosition
        updateDOM(playback.scrollPosition)
    }, [playback.scrollPosition])

    // 3. Helper to update DOM
    const updateDOM = (y: number) => {
        if (contentRef.current) {
            // Calcular offset visual baseado na posição do indicador (e.g. 50% = centro da tela)
            // Se cuePosition = 50, offset = 50% da altura do container.
            // O texto sobe 'y' pixels, e desce 'offset' pixels.
            const offset = containerHeight * (settings.cuePosition / 100)
            contentRef.current.style.transform = `translateY(${-y + offset}px)`
        }

        // Update progress bar
        const maxScroll = Math.max(0, textHeight - containerHeight * 0.4)
        const p = maxScroll > 0 ? Math.min(100, (y / maxScroll) * 100) : 0
        setProgress(p)
    }

    // 4. Animation Loop
    useEffect(() => {
        // Slave Mode: Se for janela externa, NÃO roda o loop local.
        if (isExternal) return

        let lastSyncTime = 0
        const SYNC_INTERVAL = 30 // Atualizar store a cada 30ms (~30fps) para sync externo

        if (playback.isPlaying) {
            const animate = (time: number) => {
                const maxScroll = Math.max(0, textHeight - containerHeight * 0.4)
                const speedMultiplier = playback.speed * 0.8

                scrollPosRef.current += speedMultiplier

                if (scrollPosRef.current >= maxScroll) {
                    scrollPosRef.current = maxScroll
                    updatePlayback({ isPlaying: false, scrollPosition: maxScroll }) // Stop
                } else {
                    updateDOM(scrollPosRef.current)

                    // Sync com Store periodicamente para que a janela externa receba updates
                    if (time - lastSyncTime > SYNC_INTERVAL) {
                        useAppStore.setState(state => ({
                            playback: { ...state.playback, scrollPosition: scrollPosRef.current }
                        }))
                        lastSyncTime = time
                    }

                    animationFrameRef.current = requestAnimationFrame(animate)
                }
            }
            animationFrameRef.current = requestAnimationFrame(animate)
        } else {
            // When stopping, sync final position to store
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
                updatePlayback({ scrollPosition: scrollPosRef.current })
            }
        }

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        }
    }, [playback.isPlaying, playback.speed, textHeight, containerHeight, isExternal])

    // Native listener for non-passive wheel
    useEffect(() => {
        // Scroll manual desativado na externa? Opcional, mas bom manter caso queira scrollar com mouse conectado lá.

        const el = containerRef.current
        if (!el) return

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            const maxScroll = Math.max(0, textHeight - containerHeight * 0.4)
            const delta = e.deltaY * 0.5
            let newPos = scrollPosRef.current + delta
            newPos = Math.max(0, Math.min(maxScroll, newPos))
            scrollPosRef.current = newPos
            updateDOM(newPos)
        }

        el.addEventListener('wheel', onWheel, { passive: false })
        return () => el.removeEventListener('wheel', onWheel)
    }, [textHeight, containerHeight])


    // Pre-process content (add HTML markers for cue points)
    const processedContent = (() => {
        if (!activeScript) return ''
        let index = 0
        return activeScript.content.replace(
            /(&gt;&gt;&gt;|>>>)/g,
            () => {
                const i = index++
                return `<div class="cue-point-marker" data-cue-index="${i}" style="display:flex;align-items:center;justify-content:center;width:100%;margin:15px 0;pointer-events:none;"><span style="color:var(--accent-primary);font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;opacity:0.9;text-shadow:0 0 10px rgba(48, 209, 88, 0.3);">— CUE ${i + 1} —</span></div>`
            }
        )
    })()

    return (
        <div className="teleprompter-wrapper">
            <div className="teleprompter-display" ref={containerRef}>
                {/* Fade Out Layers */}
                <div className="prompter-fade top" />

                {/* Cue Indicator */}
                {settings.cueEnabled && (
                    <CueIndicator
                        style={settings.cueStyle}
                        position={settings.cuePosition}
                        color={settings.cueColor}
                        opacity={settings.cueOpacity}
                        thickness={settings.cueThickness}
                    />
                )}

                {/* Scrollable Content */}
                <div className="prompter-viewport">
                    <div ref={contentRef} className="prompter-content">
                        <div
                            ref={textRef}
                            className={`prompter-text ${settings.isMirrored ? 'mirrored' : ''}`}
                            style={{ fontSize: `${settings.fontSize}px` }}
                            onClick={(e) => {
                                const target = e.target as HTMLElement
                                if (target.classList.contains('cue-point-marker') || target.parentElement?.classList.contains('cue-point-marker')) {
                                    togglePlay()
                                }
                            }}
                            dangerouslySetInnerHTML={{
                                __html: processedContent || '<span style="opacity: 0.5">Selecione um script</span>'
                            }}
                        />
                    </div>
                </div>

                <div className="prompter-fade bottom" />

                {/* Progress Bar */}
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
