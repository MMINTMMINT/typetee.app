'use client'

import { useDesignStore, type Font } from '@/store/designStore'
import { useState, useEffect, useRef } from 'react'
import sounds from '@/lib/sounds'
import { exportDesignAsPNG } from '@/lib/exportDesign'
import { convertImageToAscii } from '@/lib/asciiConverter'

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
  const [isFocused, setIsFocused] = useState(false)
  
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
    // Always update cursor position when text or font changes
    updateCursorPosition()
  }, [text, font])
  
  // Update cursor position function
  const updateCursorPosition = () => {
    if (!textareaRef.current) return
    
    try {
      const textarea = textareaRef.current
      // Get cursor position - use text length if no selection (cursor at end)
      const position = textarea.selectionStart !== undefined ? textarea.selectionStart : text.length
      
      // Split text into lines up to cursor position
      const textBeforeCursor = text.substring(0, position)
      const lines = textBeforeCursor.split('\n')
      const currentLineText = lines[lines.length - 1] || ''
      
      // Use canvas for precise text measurement matching textarea exactly
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      // Match the exact font style used in the textarea (from globals.css)
      // Font size: 14px, line-height: 1.8, letter-spacing: 0.05em
      ctx.font = "14px 'JetBrains Mono', monospace"
      ctx.letterSpacing = '0.05em'
      
      const textWidth = ctx.measureText(currentLineText).width
      
      // Calculate Y position based on line number
      // Line height = 14px * 1.8 = 25.2px
      const lineHeight = 14 * 1.8
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
  
  const handleExportDesign = async () => {
    playClick()
    try {
      // Get the canvas from the TShirtPreview component
      const canvas = document.querySelector('canvas')
      if (!canvas) {
        alert('Please render the design first')
        return
      }
      
      // Create a new canvas at 4500x5100 pixels
      const exportCanvas = document.createElement('canvas')
      exportCanvas.width = 4500
      exportCanvas.height = 5100
      
      const ctx = exportCanvas.getContext('2d')
      if (!ctx) return
      
      // Draw on white background
      ctx.fillStyle = theme === 'black' ? '#000000' : '#FFFFFF'
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
      
      // Scale and draw the original canvas
      const scale = Math.min(exportCanvas.width / canvas.width, exportCanvas.height / canvas.height)
      const x = (exportCanvas.width - canvas.width * scale) / 2
      const y = (exportCanvas.height - canvas.height * scale) / 2
      ctx.scale(scale, scale)
      ctx.drawImage(canvas, x / scale, y / scale)
      
      // Export as PNG
      await exportDesignAsPNG(exportCanvas, `typetee-design-${Date.now()}.png`)
      alert('Design exported successfully!')
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export design')
    }
  }
  
  const handleConvertToASCII = async () => {
    playClick()
    try {
      // Get the canvas from the TShirtPreview component
      const canvas = document.querySelector('canvas')
      if (!canvas) {
        alert('Please render the design first')
        return
      }
      
      // Get canvas image data
      const imageData = canvas.toDataURL('image/png')
      
      // Get store methods and state
      const state = useDesignStore.getState()
      const setMode = state.setMode
      const setUploadedImage = state.setUploadedImage
      const setAsciiArt = state.setAsciiArt
      const asciiDensity = state.asciiDensity
      const asciiStyle = state.asciiStyle
      
      // Store the uploaded image
      setUploadedImage(imageData)
      
      // Convert to ASCII using default density and style
      const ascii = await convertImageToAscii(imageData, asciiDensity, 120, asciiStyle)
      setAsciiArt(ascii)
      
      // Switch to ASCII mode
      setMode('ascii')
    } catch (error) {
      console.error('Conversion failed:', error)
      alert('Failed to convert to ASCII')
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
            onKeyDown={updateCursorPosition}
            onMouseUp={updateCursorPosition}
            onSelect={updateCursorPosition}
            onFocus={() => {
              setIsFocused(true)
              updateCursorPosition()
            }}
            onBlur={() => {
              setIsFocused(false)
              updateCursorPosition()
            }}
            onPaste={() => {
              setShowCursor(true)
              setTimeout(updateCursorPosition, 10)
            }}
            placeholder="Type your message..."
            className={`${inputClass} retro-input min-h-[240px] resize-none ${isFocused ? 'accent-border' : ''}`}
            maxLength={2000}
            autoFocus
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
        <div className="text-[10px] mt-2 opacity-70 leading-relaxed">
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
              } ${textSize === value ? 'active' : ''} text-[11px] py-2 px-2`}
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
            className={`${buttonClass} retro-button text-[11px] py-3 ${
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
            className={`${buttonClass} retro-button text-[11px] py-3 ${
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
            className={`${buttonClass} retro-button text-[11px] py-3 ${
              textAlign === 'right' ? 'active' : ''
            }`}
          >
            RIGHT
          </button>
        </div>
      </div>
      
      {/* Export & Convert Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <button
          onClick={handleExportDesign}
          disabled={text.length === 0}
          className={`${buttonClass} retro-button w-full text-[11px] py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            {/* Pixelated download arrow */}
            <rect x="7" y="0" width="2" height="8" />
            <rect x="5" y="6" width="2" height="2" />
            <rect x="9" y="6" width="2" height="2" />
            <rect x="3" y="8" width="2" height="2" />
            <rect x="11" y="8" width="2" height="2" />
            {/* Download box */}
            <rect x="2" y="12" width="12" height="2" />
            <rect x="2" y="14" width="12" height="2" />
          </svg>
          SAVE PNG (4500x5100)
        </button>
        <button
          onClick={handleConvertToASCII}
          disabled={text.length === 0}
          className={`${buttonClass} retro-button w-full text-[11px] py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            {/* Pixelated grid/art icon */}
            <rect x="0" y="0" width="4" height="4" />
            <rect x="6" y="0" width="4" height="4" />
            <rect x="12" y="0" width="4" height="4" />
            <rect x="0" y="6" width="4" height="4" />
            <rect x="6" y="6" width="4" height="4" />
            <rect x="12" y="6" width="4" height="4" />
            <rect x="0" y="12" width="4" height="4" />
            <rect x="6" y="12" width="4" height="4" />
            <rect x="12" y="12" width="4" height="4" />
          </svg>
          CONVERT TO ASCII ART
        </button>
      </div>
    </div>
  )
}
