
import { useState, useEffect } from 'react'
import { TitleBar } from './components/Layout/TitleBar'
import { Sidebar } from './components/Layout/Sidebar'
import { RichEditor } from './components/Editor/RichEditor'
import { TeleprompterDisplay } from './components/Prompter/TeleprompterDisplay'
import { PlaybackControls } from './components/Controls/PlaybackControls'
import { SettingsPanel } from './components/Controls/SettingsPanel'
import { useAppStore } from './store/useAppStore'

import { useWindowSync } from './hooks/useWindowSync'

function App() {
  // Activate Master Sync
  useWindowSync(true)

  // UI State (Non-persistent)
  const [isEditing, setIsEditing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Global Actions from Store
  const togglePlay = useAppStore(state => state.togglePlay)
  const resetPlayback = useAppStore(state => state.resetPlayback)
  const updateSettings = useAppStore(state => state.updateSettings)
  const playback = useAppStore(state => state.playback)

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if editing (except Escape)
      if (isEditing && e.code !== 'Escape') return

      switch (e.code) {
        case 'Space':
          if (!isEditing) {
            e.preventDefault()
            togglePlay()
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          useAppStore.getState().updatePlayback({ speed: Math.min(10, playback.speed + 0.5) })
          break
        case 'ArrowDown':
          e.preventDefault()
          useAppStore.getState().updatePlayback({ speed: Math.max(0.5, playback.speed - 0.5) })
          break
        case 'KeyR':
          if (!isEditing) {
            e.preventDefault()
            resetPlayback()
          }
          break
        case 'KeyM':
          if (!isEditing) {
            e.preventDefault()
            updateSettings({ isMirrored: !useAppStore.getState().settings.isMirrored })
          }
          break
        case 'KeyE':
          e.preventDefault()
          setIsEditing(prev => !prev)
          if (!isEditing) {
            // Entering edit mode
            resetPlayback()
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
  }, [isEditing, showSettings, isFullscreen, playback.speed])

  // Timer Effect Logic needs to be in App or Middleware?
  // We can put it in TeleprompterDisplay if it ONLY runs when playing.
  // But updating `elapsedTime` in global store is useful.
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (playback.isPlaying) {
      interval = setInterval(() => {
        useAppStore.getState().updatePlayback({
          elapsedTime: useAppStore.getState().playback.elapsedTime + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [playback.isPlaying])

  return (
    <div className={`app ${isFullscreen ? 'fullscreen' : ''}`}>
      <TitleBar />

      <div className="app-container">
        <Sidebar onOpenSettings={() => setShowSettings(true)} />

        <main className="main-content">
          {isEditing ? (
            <RichEditor onClose={() => setIsEditing(false)} />
          ) : (
            <>
              <TeleprompterDisplay />
              <PlaybackControls
                onStartEdit={() => setIsEditing(true)}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
              />
            </>
          )}
        </main>

        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </div>
  )
}

export default App
