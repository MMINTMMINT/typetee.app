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
    <div className={`retro-panel ${panelClass}`}>
      <h2 className="font-pressStart text-[12px] mb-6 leading-relaxed">DESIGN CONTROLS</h2>
      
      {/* Mode Selection */}
      <div className="mb-6">
        <label className="block font-bold mb-3 text-[10px] leading-relaxed">DESIGN MODE:</label>
        <div className="flex gap-3">
          <button
            onClick={() => {
              playClick()
              setMode('text')
            }}
            className={`${buttonClass} retro-button flex-1 ${
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
            className={`${buttonClass} retro-button flex-1 ${
              mode === 'ascii' ? 'active' : ''
            }`}
          >
            ASCII ART
          </button>
        </div>
      </div>
      
      {/* Mode-specific Controls */}
      {mode === 'text' ? <TextControls /> : <AsciiControls />}
      
      {/* Placement Controls */}
      <PlacementControls />
    </div>
  )
}
