
export interface Script {
  id: string
  name: string
  content: string
  createdAt: Date
}

export type CueStyleType =
  | 'arrow-left'        // 1. Seta só na esquerda ▶
  | 'arrow-left-line'   // 2. Seta esquerda + linha ▶━━━
  | 'full'              // 3. Seta esquerda + linha + seta direita ▶━━━◀
  | 'line-arrow-right'  // 4. Linha + seta direita ━━━◀
  | 'arrow-right'       // 5. Seta só na direita ◀
  | 'arrows-only'       // 6. Seta esquerda + seta direita (sem linha) ▶  ◀
  | 'line-only'         // 7. Somente linha ━━━━━

export interface AppSettings {
  // Appearance
  fontSize: number
  isMirrored: boolean

  // Cue Indicator
  cueEnabled: boolean
  cueStyle: CueStyleType
  cuePosition: number // % from top
  cueColor: string
  cueOpacity: number
  cueThickness: number

  // Sidebar
  sidebarCollapsed: boolean
}

export interface PlaybackState {
  isPlaying: boolean
  speed: number
  scrollPosition: number
  elapsedTime: number
  cueAction?: { type: 'next' | 'prev', id: number }
}
