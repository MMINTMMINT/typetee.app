'use client'

import { useDesignStore, type Font } from '@/store/designStore'
import { useState, useEffect, useRef } from 'react'
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  
  const inputClass = theme === 'black' ? 'retro-input-black' : 'retro-input-white'
  const buttonClass = theme === 'black' ? 'retro-button-black' : 'retro-button-white'
  
  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])
  
  // Calculate cursor position based on textarea cursor position
  useEffect(() => {
    updateCursorPosition()
  }, [text])
  
  // Update cursor position function
  const updateCursorPosition = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const position = textarea.selectionStart
      
      // Split text into lines up to cursor position
      const textBeforeCursor = text.substring(0, position)
      const lines = textBeforeCursor.split('\n')
      const currentLineText = lines[lines.length - 1]
      
      // Create a temporary span to measure the text width
      const span = document.createElement('span')
      span.style.position = 'absolute'
      span.style.visibility = 'hidden'
      span.style.font = window.getComputedStyle(textarea).font
      span.style.whiteSpace = 'pre'
      span.textContent = currentLineText
      document.body.appendChild(span)
      
      const textWidth = span.offsetWidth
      document.body.removeChild(span)
      
      // Calculate Y position based on line number
      const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight) || 24
      const lineNumber = lines.length - 1
      
      // Calculate cursor position
      const cursorX = 24 + textWidth + 8 // 24px left padding + 8px right shift
      const cursorY = 16 + (lineNumber * lineHeight) + (lineHeight / 2) - 16 // Vertically center + 16px up shift
      
      setCursorPos({ 
        x: Math.max(24, Math.min(cursorX, textarea.clientWidth - 24)),
        y: Math.max(16, cursorY)
      })
    }
  }
  
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
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              updateCursorPosition()
            }}
            onInput={updateCursorPosition}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            placeholder="Type your message..."
            className={`${inputClass} retro-input min-h-[120px] resize-none`}
            maxLength={200}
          />
          {showCursor && (
            <span 
              className="absolute text-2xl animate-blink pointer-events-none"
              style={{
                top: `${cursorPos.y}px`,
                left: `${cursorPos.x}px`,
                fontFamily: "'Press Start 2P', monospace",
              }}
            >
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
              className={`${buttonClass} retro-button text-left px-4 py-4 ${
                font === f.value ? 'active' : ''
              }`}
              style={{
                fontFamily: f.value === 'pressStart' ? "'Press Start 2P', monospace" : 
                           f.value === 'vt323' ? "'VT323', monospace" :
                           "'Commodore 64 Pixelized', monospace",
                fontSize: f.value === 'pressStart' ? '16px' :
                         f.value === 'vt323' ? '18px' : '16px',
                lineHeight: '1.4',
              }}
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
