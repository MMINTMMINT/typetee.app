'use client'

import { useDesignStore } from '@/store/designStore'
import sounds from '@/lib/sounds'

export function SoundToggle() {
  const soundEnabled = useDesignStore((state) => state.soundEnabled)
  const toggleSound = useDesignStore((state) => state.toggleSound)
  const theme = useDesignStore((state) => state.theme)
  
  const handleToggle = () => {
    toggleSound()
    if (!soundEnabled) {
      // Play click sound when turning sound ON
      sounds.click()
    }
  }
  
  const buttonClass = theme === 'black' ? 'retro-button-black' : 'retro-button-white'
  
  return (
    <button
      onClick={handleToggle}
      className="p-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0"
      aria-label={soundEnabled ? 'Sound On' : 'Sound Off'}
      style={{ background: 'transparent', border: 'none' }}
    >
      <div className="relative w-6 h-6 sm:w-7 sm:h-7" style={{ color: theme === 'black' ? '#FFFFFF' : '#000000' }}>
        {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
      </div>
    </button>
  )
}

function SoundOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      {/* Speaker box (pixel style) */}
      <rect x="3" y="8" width="4" height="8" />
      <rect x="7" y="6" width="4" height="12" />
      
      {/* Sound waves (3 waves) */}
      <rect x="14" y="7" width="2" height="2" />
      <rect x="14" y="15" width="2" height="2" />
      
      <rect x="17" y="5" width="2" height="2" />
      <rect x="17" y="11" width="2" height="2" />
      <rect x="17" y="17" width="2" height="2" />
      
      <rect x="20" y="3" width="2" height="2" />
      <rect x="20" y="9" width="2" height="2" />
      <rect x="20" y="13" width="2" height="2" />
      <rect x="20" y="19" width="2" height="2" />
    </svg>
  )
}

function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      {/* Speaker box (pixel style) */}
      <rect x="3" y="8" width="4" height="8" />
      <rect x="7" y="6" width="4" height="12" />
      
      {/* X symbol for muted (pixel style) */}
      <rect x="14" y="6" width="2" height="2" />
      <rect x="16" y="8" width="2" height="2" />
      <rect x="18" y="10" width="2" height="2" />
      <rect x="20" y="12" width="2" height="2" />
      <rect x="18" y="14" width="2" height="2" />
      <rect x="16" y="16" width="2" height="2" />
      <rect x="14" y="18" width="2" height="2" />
      
      <rect x="20" y="6" width="2" height="2" />
      <rect x="18" y="8" width="2" height="2" />
      <rect x="16" y="10" width="2" height="2" />
      <rect x="14" y="12" width="2" height="2" />
      <rect x="16" y="14" width="2" height="2" />
      <rect x="18" y="16" width="2" height="2" />
      <rect x="20" y="18" width="2" height="2" />
    </svg>
  )
}
