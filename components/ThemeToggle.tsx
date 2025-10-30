'use client'

import { useDesignStore } from '@/store/designStore'
import sounds from '@/lib/sounds'

export function ThemeToggle() {
  const theme = useDesignStore((state) => state.theme)
  const setTheme = useDesignStore((state) => state.setTheme)
  const soundEnabled = useDesignStore((state) => state.soundEnabled)
  
  const handleThemeChange = (newTheme: 'black' | 'white') => {
    if (soundEnabled) {
      sounds.themeToggle()
    }
    setTheme(newTheme)
  }
  
  return (
    <>
      {/* Desktop Version */}
      <div className="hidden sm:flex items-center gap-0 font-pressStart text-[10px] border-[6px] border-current p-1" style={{ backgroundColor: theme === 'black' ? '#000000' : '#FFFFFF' }}>
        <button
          onClick={() => handleThemeChange('black')}
          className={`
            px-6 py-3 border-[4px] transition-all font-bold uppercase
            ${theme === 'black'
              ? 'bg-terminal-black text-terminal-white border-terminal-white'
              : 'bg-terminal-black text-terminal-white border-transparent'
            }
          `}
        >
          BLACK
        </button>
        <button
          onClick={() => handleThemeChange('white')}
          className={`
            px-6 py-3 border-[4px] transition-all font-bold uppercase
            ${theme === 'white'
              ? 'bg-terminal-white text-terminal-black border-terminal-black'
              : 'bg-terminal-white text-terminal-black border-transparent'
            }
          `}
        >
          WHITE
        </button>
      </div>
      
      {/* Mobile Version - Minimal diagonal toggle */}
      <button
        onClick={() => handleThemeChange(theme === 'black' ? 'white' : 'black')}
        className="sm:hidden w-8 h-8 border-[2px] sm:border-[4px] transition-all flex items-center justify-center relative overflow-hidden"
        style={{
          borderColor: theme === 'black' ? '#FFFFFF' : '#000000',
          background: `linear-gradient(135deg, #000000 50%, #FFFFFF 50%)`,
        }}
        title={`Switch to ${theme === 'black' ? 'white' : 'black'} theme`}
      />

    </>
  )
}
