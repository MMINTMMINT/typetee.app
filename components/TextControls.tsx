'use client'

import { useDesignStore, type Font } from '@/store/designStore'
import { useState, useEffect } from 'react'
import sounds from '@/lib/sounds'

export function TextControls() {
  const theme = useDesignStore((state) => state.theme)
  const text = useDesignStore((state) => state.text)
  const setText = useDesignStore((state) => state.setText)
  const font = useDesignStore((state) => state.font)
  const setFont = useDesignStore((state) => state.setFont)
  const textSize = useDesignStore((state) => state.textSize)
  const setTextSize = useDesignStore((state) => state.setTextSize)
  const textAlign = useDesignStore((state) => state.textAlign)
  const setTextAlign = useDesignStore((state) => state.setTextAlign)
  const soundEnabled = useDesignStore((state) => state.soundEnabled)
  
  const [showCursor, setShowCursor] = useState(true)
  
  const inputClass = theme === 'black' ? 'retro-input-black' : 'retro-input-white'
  const buttonClass = theme === 'black' ? 'retro-button-black' : 'retro-button-white'
  
  // Blinking cursor effect on initial load
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])
  
  const playClick = () => {
    if (soundEnabled) {
      sounds.click()
    }
  }
  
  const fonts: { value: Font; label: string; class: string }[] = [
    { value: 'pressStart', label: 'PRESS START', class: 'font-pressStart' },
    { value: 'vt323', label: 'VT323', class: 'font-vt323' },
    { value: 'commodore', label: 'COMMODORE', class: 'font-commodore' },
  ]
  
  // Text size options (chunky, stepped - not smooth)
  const sizeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  
  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div>
        <label className="block font-bold mb-3 text-[10px] leading-relaxed">YOUR TEXT:</label>
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className={`${inputClass} retro-input min-h-[120px] resize-none`}
            maxLength={200}
          />
          {text === '' && showCursor && (
            <span className="absolute top-4 left-4 text-2xl animate-blink pointer-events-none">
              █
            </span>
          )}
        </div>
        <div className="text-[8px] mt-2 opacity-70 leading-relaxed">
          {text.length}/200 CHARACTERS
        </div>
      </div>
      
      {/* Font Selection */}
      <div>
        <label className="block font-bold mb-3 text-[10px] leading-relaxed">FONT:</label>
        <div className="grid grid-cols-1 gap-2">
          {fonts.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                playClick()
                setFont(f.value)
              }}
              className={`${buttonClass} retro-button text-left ${f.class} ${
                font === f.value ? 'active' : ''
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Text Size Slider */}
      <div>
        <label className="block font-bold mb-3 text-[10px] leading-relaxed">
          SIZE: {textSize}
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={textSize}
            onChange={(e) => {
              playClick()
              setTextSize(parseInt(e.target.value))
            }}
            className="w-full h-8 appearance-none cursor-pointer"
            style={{
              background: theme === 'black' 
                ? `linear-gradient(to right, white 0%, white ${textSize * 10}%, transparent ${textSize * 10}%, transparent 100%)`
                : `linear-gradient(to right, black 0%, black ${textSize * 10}%, transparent ${textSize * 10}%, transparent 100%)`,
              border: `6px solid ${theme === 'black' ? 'white' : 'black'}`,
            }}
          />
          <div className="flex justify-between text-[8px] leading-relaxed">
            <span>SMALL</span>
            <span>LARGE</span>
          </div>
        </div>
      </div>
      
      {/* Text Alignment */}
      <div>
        <label className="block font-bold mb-3 text-[10px] leading-relaxed">ALIGN:</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              playClick()
              setTextAlign('left')
            }}
            className={`${buttonClass} retro-button text-[10px] py-3 ${
              textAlign === 'left' ? 'active' : ''
            }`}
          >
            LEFT
          </button>
          <button
            onClick={() => {
              playClick()
              setTextAlign('center')
            }}
            className={`${buttonClass} retro-button text-[10px] py-3 ${
              textAlign === 'center' ? 'active' : ''
            }`}
          >
            CENTER
          </button>
          <button
            onClick={() => {
              playClick()
              setTextAlign('right')
            }}
            className={`${buttonClass} retro-button text-[10px] py-3 ${
              textAlign === 'right' ? 'active' : ''
            }`}
          >
            RIGHT
          </button>
        </div>
      </div>
    </div>
  )
}
