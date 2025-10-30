'use client'

import { useDesignStore } from '@/store/designStore'

export function PixelLogo() {
  const theme = useDesignStore((state) => state.theme)
  
  const logo = `▀▀█▀▀ ▒█░░▒█ ▒█▀▀█ ▒█▀▀▀ ▀▀█▀▀ ▒█▀▀▀ ▒█▀▀▀   ░ ▒█▀▀█ ▒█▀▀█ ▒█▀▀█
░▒█░░ ▒█▄▄▄█ ▒█▄▄█ ▒█▀▀▀ ░▒█░░ ▒█▀▀▀ ▒█▀▀▀   ▄ ▒█▄▄█ ▒█▄▄█ ▒█▄▄█
░▒█░░ ░░▒█░░ ▒█░░░ ▒█▄▄▄ ░▒█░░ ▒█▄▄▄ ▒█▄▄▄   █ ▒█░▒█ ▒█░░░ ▒█░░░`

  return (
    <pre 
      className="font-mono text-[6px] sm:text-[10px] md:text-xs leading-tight whitespace-pre"
      style={{
        color: theme === 'black' ? '#FFFFFF' : '#000000',
      }}
    >
      {logo}
    </pre>
  )
}
