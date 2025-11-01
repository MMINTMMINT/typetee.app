'use client'

import { useDesignStore } from '@/store/designStore'
import sounds from '@/lib/sounds'

export function PlacementControls() {
  const theme = useDesignStore((state) => state.theme)
  const placement = useDesignStore((state) => state.placement)
  const setPlacement = useDesignStore((state) => state.setPlacement)
  const soundEnabled = useDesignStore((state) => state.soundEnabled)
  
  const buttonClass = theme === 'black' ? 'retro-button-black' : 'retro-button-white'
  
  const playClick = () => {
    if (soundEnabled) {
      sounds.click()
    }
  }
  
  return (
    <div className="mt-6">
      <label className="block font-bold mb-3 text-[10px] leading-relaxed">PLACEMENT:</label>
      <div className="flex gap-3">
        <button
          onClick={() => {
            playClick()
            setPlacement('front')
          }}
          className={`${buttonClass} retro-button flex-1 ${
            placement === 'front' ? 'active' : ''
          }`}
        >
          FRONT
        </button>
        <button
          onClick={() => {
            playClick()
            setPlacement('back')
          }}
          className={`${buttonClass} retro-button flex-1 ${
            placement === 'back' ? 'active' : ''
          }`}
        >
          BACK
        </button>
      </div>
    </div>
  )
}
