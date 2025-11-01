'use client'

import { useDesignStore } from '@/store/designStore'

export function PixelLogo() {
  const theme = useDesignStore((state) => state.theme)
  
  const line1Type = `▀▀█▀▀ ▒█░░▒█ ▒█▀▀█ ▒█▀▀▀ `
  const line1Rest = `▀▀█▀▀ ▒█▀▀▀ ▒█▀▀▀   ░ ▒█▀▀█ ▒█▀▀█ ▒█▀▀█`
  
  const line2Type = `░▒█░░ ▒█▄▄▄█ ▒█▄▄█ ▒█▀▀▀ `
  const line2Rest = `░▒█░░ ▒█▀▀▀ ▒█▀▀▀   ▄ ▒█▄▄█ ▒█▄▄█ ▒█▄▄█`
  
  const line3Type = `░▒█░░ ░░▒█░░ ▒█░░░ ▒█▄▄▄ `
  const line3Rest = `░▒█░░ ▒█▄▄▄ ▒█▄▄▄   █ ▒█░▒█ ▒█░░░ ▒█░░░`

  return (
    <pre 
      className="font-mono text-[4px] sm:text-[7px] md:text-[9px] leading-tight whitespace-pre"
      style={{
        color: theme === 'black' ? '#FFFFFF' : '#000000',
      }}
    >
      <span style={{ color: '#fe8181' }}>{line1Type}</span><span>{line1Rest}</span>
      {'\n'}
      <span style={{ color: '#fe8181' }}>{line2Type}</span><span>{line2Rest}</span>
      {'\n'}
      <span style={{ color: '#fe8181' }}>{line3Type}</span><span>{line3Rest}</span>
    </pre>
  )
}
