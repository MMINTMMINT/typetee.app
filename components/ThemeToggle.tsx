'use client'

import { useDesignStore } from '@/store/designStore'
import sounds from '@/lib/sounds'

export function ThemeToggle() {
  const theme = useDesignStore((state) => state.theme)
  const setTheme = useDesignStore((state) => state.setTheme)
  const soundEnabled = useDesignStore((state) => state.soundEnabled)
  
  const buttonClass = theme === 'black' ? 'retro-button-black' : 'retro-button-white'
  
  const handleThemeChange = (newTheme: 'black' | 'white') => {
    if (soundEnabled) {
      sounds.themeToggle()
    }
    setTheme(newTheme)
  }
  
  return (
    <>
      {/* Desktop Version */}
      <div className="hidden sm:flex items-center gap-2 font-pressStart text-[10px]">
        <button
          onClick={() => handleThemeChange('black')}
          className={`${buttonClass} retro-button px-6 py-3 ${
            theme === 'black' ? 'active' : ''
          }`}
        >
          BLACK
        </button>
        <button
          onClick={() => handleThemeChange('white')}
          className={`${buttonClass} retro-button px-6 py-3 ${
            theme === 'white' ? 'active' : ''
          }`}
        >
          WHITE
        </button>
      </div>
      
      {/* Mobile Version - Toggle with accent color */}
      <button
        onClick={() => handleThemeChange(theme === 'black' ? 'white' : 'black')}
        className="sm:hidden relative w-12 h-6 border-[3px] border-terminal-accent transition-all duration-300 focus:outline-none"
        style={{
          backgroundColor: theme === 'black' ? '#fe8181' : '#FFFFFF',
        }}
        title={`Switch to ${theme === 'black' ? 'white' : 'black'} theme`}
      >
        <div
          className="absolute top-0.5 left-0.5 w-4 h-4 transition-transform duration-300"
          style={{
            backgroundColor: theme === 'black' ? '#000000' : '#fe8181',
            transform: theme === 'black' ? 'translateX(24px)' : 'translateX(0px)',
          }}
        />
      </button>

    </>
  )
}
