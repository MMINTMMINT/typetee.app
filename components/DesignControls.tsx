'use client'

import { useDesignStore } from '@/store/designStore'
import { TextControls } from './TextControls'
import { AsciiControls } from './AsciiControls'
import { PlacementControls } from './PlacementControls'
import sounds from '@/lib/sounds'

export function DesignControls() {
  const theme = useDesignStore((state) => state.theme)
  const mode = useDesignStore((state) => state.mode)
  const setMode = useDesignStore((state) => state.setMode)
  const soundEnabled = useDesignStore((state) => state.soundEnabled)
  
  const panelClass = theme === 'black' ? 'retro-panel-black' : 'retro-panel-white'
  const buttonClass = theme === 'black' ? 'retro-button-black' : 'retro-button-white'
  
  const playClick = () => {
    if (soundEnabled) {
      sounds.modeSelect()
    }
  }
  
  return (
    <div className={`${panelClass} font-jetbrainsMono xl:retro-panel xl:border-[3px]`} style={{ backgroundColor: '#18181b' }}>
      <h2 className="font-jetbrainsMono text-[14px] mb-6 leading-relaxed accent-glow">DESIGN CONTROLS</h2>
      
      {/* Mode Selection */}
      <div className="mb-6">
        <label className="block font-bold mb-3 text-[12px] leading-relaxed font-jetbrainsMono">DESIGN MODE:</label>
        <div className="flex gap-3">
          <button
            onClick={() => {
              playClick()
              setMode('text')
            }}
            className={`${buttonClass} retro-button flex-1 font-jetbrainsMono ${
              mode === 'text' ? 'active' : ''
            }`}
          >
            TEXT
          </button>
          <button
            onClick={() => {
              playClick()
              setMode('ascii')
            }}
            className={`${buttonClass} retro-button flex-1 font-jetbrainsMono ${
              mode === 'ascii' ? 'active' : ''
            }`}
          >
            ASCII ART
          </button>
        </div>
      </div>
      
      {/* Mode-specific Controls */}
      {mode === 'text' ? <TextControls /> : <AsciiControls />}
    </div>
  )
}
