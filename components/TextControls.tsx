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
    // Small delay to ensure textarea has rendered with new text
    const timer = setTimeout(updateCursorPosition, 0)
    return () => clearTimeout(timer)
  }, [text, font])
  
  // Update cursor position function
  const updateCursorPosition = () => {
    if (!textareaRef.current) return
    
    try {
      const textarea = textareaRef.current
      const position = textarea.selectionStart || 0
      
      // Split text into lines up to cursor position
      const textBeforeCursor = text.substring(0, position)
      const lines = textBeforeCursor.split('\n')
      const currentLineText = lines[lines.length - 1] || ''
      
      // Use canvas for precise text measurement matching textarea exactly
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      // Match the exact font style used in the textarea (from globals.css)
      // Font size: 12px, line-height: 1.8, letter-spacing: 0.05em
      ctx.font = "12px 'Press Start 2P', monospace"
      ctx.letterSpacing = '0.05em'
      
      const textWidth = ctx.measureText(currentLineText).width
      
      // Calculate Y position based on line number
      // Line height = 12px * 1.8 = 21.6px
      const lineHeight = 12 * 1.8
      const lineNumber = lines.length - 1
      
      // Calculate cursor position
      // px-6 = 24px left padding, py-4 = 16px top padding
      const cursorX = currentLineText.length > 0 ? 24 + textWidth : 24
      const cursorY = 16 + (lineNumber * lineHeight)
      
      setCursorPos({ 
        x: cursorX,
        y: cursorY
      })
    } catch (error) {
      console.error('Error updating cursor position:', error)
      // Set default cursor position on error
      setCursorPos({ x: 24, y: 16 })
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
              // Delay cursor update to ensure textarea has updated
              setTimeout(updateCursorPosition, 0)
            }}
            onInput={updateCursorPosition}
            onClick={() => {
              // Force immediate update on click
              setTimeout(updateCursorPosition, 0)
            }}
            onKeyUp={updateCursorPosition}
            onKeyDown={updateCursorPosition}
            onMouseUp={updateCursorPosition}
            onSelect={updateCursorPosition}
            onFocus={updateCursorPosition}
            onPaste={() => {
              // Update cursor after paste completes and ensure it's visible
              setShowCursor(true)
              setTimeout(() => {
                updateCursorPosition()
              }, 10)
            }}
            placeholder="Type your message..."
            className={`${inputClass} retro-input min-h-[240px] resize-none`}
            maxLength={2000}
          />
          {showCursor && (
            <span 
              className="absolute animate-blink pointer-events-none text-lg"
              style={{
                top: `${cursorPos.y - 2}px`,
                left: `${cursorPos.x}px`,
                fontFamily: "'Press Start 2P', monospace",
              }}
            >
              █
            </span>
          )}
        </div>
        <div className="text-[8px] mt-2 opacity-70 leading-relaxed">
          {text.length}/2000 CHARACTERS
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
      
      {/* Text Size Buttons */}
      <div>
        <label className="block font-bold mb-3 text-[10px] leading-relaxed">
          SIZE:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 2, label: 'SMALL' },
            { value: 3, label: 'MEDIUM' },
            { value: 4, label: 'LARGE' },
            { value: 5, label: 'X-LARGE' },
            { value: 7, label: 'XX-LARGE' },
            { value: 9, label: 'HUGE' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => {
                playClick()
                setTextSize(value)
              }}
              className={`retro-button ${
                theme === 'black' ? 'retro-button-black' : 'retro-button-white'
              } ${textSize === value ? 'active' : ''} text-[9px] py-2 px-2`}
            >
              {label}
            </button>
          ))}
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
