'use client'

import { useDesignStore } from '@/store/designStore'
import { useEffect, useRef, useMemo } from 'react'
import { asciiToSvg } from '@/lib/asciiConverter'

export function TShirtPreview() {
  const theme = useDesignStore((state) => state.theme)
  const mode = useDesignStore((state) => state.mode)
  const text = useDesignStore((state) => state.text)
  const font = useDesignStore((state) => state.font)
  const textSize = useDesignStore((state) => state.textSize)
  const textAlign = useDesignStore((state) => state.textAlign)
  const asciiArt = useDesignStore((state) => state.asciiArt)
  const asciiSize = useDesignStore((state) => state.asciiSize)
  const placement = useDesignStore((state) => state.placement)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const fontMap = {
    vt323: 'VT323',
    commodore: '"Commodore 64 Pixelized", monospace',
    pressStart: '"Press Start 2P"',
  }
  
  // Generate SVG for ASCII art
  const asciiSvg = useMemo(() => {
    if (mode !== 'ascii' || !asciiArt) return null
    
    const foregroundColor = theme === 'black' ? '#FFFFFF' : '#000000'
    const backgroundColor = theme === 'black' ? '#000000' : '#FFFFFF'
    
    // Calculate the maximum font size that fits all content in print area
    const lines = asciiArt.split('\n')
    const maxLineLength = Math.max(...lines.map(line => line.length))
    const numLines = lines.length
    
    // Print area dimensions: 4606 x 5787px at 300 DPI
    const printWidth = 4606
    const printHeight = 5787
    
    // Character dimensions (monospace approximation)
    const charWidthRatio = 0.6 // width = fontSize * 0.6
    const lineHeightRatio = 1.2 // height = fontSize * 1.2
    
    // Calculate max font size that fits all content
    const maxFontSizeByWidth = printWidth / (maxLineLength * charWidthRatio)
    const maxFontSizeByHeight = printHeight / (numLines * lineHeightRatio)
    const maxFontSize = Math.min(maxFontSizeByWidth, maxFontSizeByHeight)
    
    // At asciiSize=5 (middle), use maxFontSize (fills print area)
    // At asciiSize=1, use 20% of maxFontSize (tiny)
    // At asciiSize=10, use 200% of maxFontSize (huge, will be clipped)
    const scale = (asciiSize / 5) // 1→0.2, 5→1.0, 10→2.0
    const fontSize = maxFontSize * scale
    
    // includeBackground=false to let the t-shirt show through
    return asciiToSvg(asciiArt, fontSize, 'monospace', foregroundColor, backgroundColor, printWidth, printHeight, false)
  }, [asciiArt, asciiSize, theme, mode])
  
  // Update canvas with design
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    // Only update canvas for text mode - skip entirely for ASCII mode
    if (mode !== 'text') return
    
    // Set canvas size for text mode
    // For text mode: use same print area ratio as ASCII (4606 x 5787)
    const printAreaRatio = 4606 / 5787
    const maxWidth = 460
    const maxHeight = 579
    // Text uses full print area
    const displayWidth = maxWidth
    const displayHeight = maxHeight
    
    // Scale up canvas resolution for sharper rendering (2x internal resolution)
    const dpr = 2 // Device pixel ratio
    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr
    
    // Scale the context to match the CSS size
    ctx.scale(dpr, dpr)
    
    // Enable pixelated rendering - disable smoothing
    ctx.imageSmoothingEnabled = false
    
    // Clear canvas
    ctx.fillStyle = theme === 'black' ? '#000000' : '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw design based on mode
    if (mode === 'text' && text) {
      // Enable pixel-perfect rendering
      ctx.imageSmoothingEnabled = false
      ctx.fillStyle = theme === 'black' ? '#FFFFFF' : '#000000'
      
      // Set alignment based on textAlign setting
      if (textAlign === 'left') {
        ctx.textAlign = 'left'
      } else if (textAlign === 'center') {
        ctx.textAlign = 'center'
      } else {
        ctx.textAlign = 'right'
      }
      ctx.textBaseline = 'top'
      
      // Calculate font size based on textSize scale
      let fontSize: number
      
      // Base sizing: textSize * 10 (size 2 = 20px, size 3 = 30px, etc)
      // Reduced from textSize * 14 to make all sizes smaller
      fontSize = textSize * 10
      
      // Ensure size stays within reasonable bounds
      fontSize = Math.max(fontSize, 12) // Minimum 12px
      fontSize = Math.min(fontSize, 140) // Maximum 140px (reduced from 180px)
      
      ctx.font = `900 ${fontSize}px ${fontMap[font]}` // Weight 900 for extra bold
      ctx.letterSpacing = '-2px' // Tighter letter spacing for better appearance
      
      // Process text: split by newlines first, then wrap each line
      const inputLines = text.split('\n')
      const lines: string[] = []
      const maxWidth = displayWidth - 40 // Padding (20px left + 20px right)
      
      for (const inputLine of inputLines) {
        // For each input line, apply word wrapping
        if (inputLine.trim() === '') {
          // Empty line
          lines.push('')
          continue
        }
        
        const words = inputLine.split(' ')
        let currentLine = ''
        
        for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
          const word = words[wordIndex]
          
          if (currentLine === '') {
            // Start a new line with this word - but check if word itself fits
            const wordWidth = ctx.measureText(word).width
            if (wordWidth <= maxWidth) {
              currentLine = word
            } else {
              // Word is too long even for empty line - need to hyphenate
              let remainingWord = word
              while (remainingWord.length > 0) {
                let nextFitWord = ''
                for (let charIndex = 1; charIndex <= remainingWord.length; charIndex++) {
                  const partialWord = remainingWord.substring(0, charIndex)
                  const testWidth = ctx.measureText(partialWord).width
                  if (testWidth <= maxWidth) {
                    nextFitWord = partialWord
                  } else {
                    break
                  }
                }
                if (nextFitWord.length > 0 && nextFitWord.length < remainingWord.length) {
                  lines.push(nextFitWord + '-')
                  remainingWord = remainingWord.substring(nextFitWord.length)
                } else {
                  currentLine = remainingWord
                  remainingWord = ''
                }
              }
            }
          } else {
            // Try adding word to current line
            const testLine = currentLine + ' ' + word
            const testWidth = ctx.measureText(testLine).width
            
            if (testWidth <= maxWidth) {
              // Fits!
              currentLine = testLine
            } else {
              // Doesn't fit - check if we need to cut the word
              // First, try to fit as many characters of the word as possible
              let charIndex = 0
              let bestFitWord = ''
              
              for (charIndex = 1; charIndex <= word.length; charIndex++) {
                const partialWord = word.substring(0, charIndex)
                const testLineWithPartial = currentLine + ' ' + partialWord
                const testWidthWithPartial = ctx.measureText(testLineWithPartial).width
                
                if (testWidthWithPartial <= maxWidth) {
                  bestFitWord = partialWord
                } else {
                  break
                }
              }
              
              // If we fit any part of the word, add it with hyphen
              if (bestFitWord.length > 0 && bestFitWord.length < word.length) {
                // Word is cut - add hyphen
                lines.push(currentLine + ' ' + bestFitWord + '-')
                // Continue with the rest of the word on new lines
                let remainingWord = word.substring(bestFitWord.length)
                
                // Keep breaking the remaining word across lines if needed
                while (remainingWord.length > 0) {
                  let nextFitWord = ''
                  
                  for (charIndex = 1; charIndex <= remainingWord.length; charIndex++) {
                    const partialWord = remainingWord.substring(0, charIndex)
                    const testWidth = ctx.measureText(partialWord).width
                    
                    if (testWidth <= maxWidth) {
                      nextFitWord = partialWord
                    } else {
                      break
                    }
                  }
                  
                  if (nextFitWord.length > 0 && nextFitWord.length < remainingWord.length) {
                    // Still need to cut
                    lines.push(nextFitWord + '-')
                    remainingWord = remainingWord.substring(nextFitWord.length)
                  } else {
                    // Rest of word fits on this line
                    currentLine = remainingWord
                    remainingWord = ''
                  }
                }
              } else {
                // Complete word doesn't fit at all, or fits completely
                // Push current line and start new one with the full word
                if (currentLine.length > 0) {
                  lines.push(currentLine)
                }
                currentLine = word
              }
            }
          }
        }
        
        // Push remaining text
        if (currentLine.length > 0) {
          lines.push(currentLine)
        }
      }
      
      // Draw lines with proper alignment and extra blocky rendering
      const lineHeight = fontSize * 1.1
      const startY = 20 // Top-aligned with padding
      const maxHeight = displayHeight - 20 // Bottom padding
      
      lines.forEach((line, i) => {
        const yPos = startY + i * lineHeight
        // Stop drawing if text would exceed bottom boundary
        if (yPos > maxHeight) return
        
        let xPos: number
        if (textAlign === 'left') {
          xPos = 20
        } else if (textAlign === 'center') {
          xPos = displayWidth / 2
        } else { // right
          xPos = displayWidth - 20
        }
        
        // Draw text multiple times slightly offset for extra bold blocky effect
        ctx.fillText(line, xPos, yPos)
        ctx.fillText(line, xPos + 0.5, yPos)
        ctx.fillText(line, xPos, yPos + 0.5)
      })
    }
  }, [theme, mode, text, font, textSize, textAlign, asciiArt, asciiSize])
  
  return (
    <div className="p-4 w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full max-w-full">
        {/* T-Shirt SVG Outline with Design Overlay */}
        <div 
          className="relative w-full"
        >
          <img
            src={placement === 'front' ? '/front.svg' : '/back.svg'}
            alt={`T-Shirt ${placement}`}
            className="w-full h-auto"
            style={{
              display: 'block',
              filter: theme === 'black' ? 'invert(1)' : 'none',
            }}
          />
          
          {/* Design Canvas Overlay - Positioned inside body */}
          <div 
            className="absolute flex justify-center"
            style={{
              top: placement === 'front' ? '20%' : '18%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '45%',
              height: '55%',
              alignItems: 'flex-start',
            }}
          >
            {mode === 'text' ? (
              <canvas
                ref={canvasRef}
                className="pixelated"
                style={{ 
                  imageRendering: 'pixelated',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  display: 'block',
                }}
              />
            ) : asciiSvg ? (
              <div
                style={{
                  aspectRatio: '4606 / 5787',
                  width: '100%',
                  height: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: asciiSvg }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      
      {(!text && !asciiArt) && (
        <p className="text-center mt-6 opacity-70 text-[10px] leading-relaxed">
          {mode === 'text' ? 'Enter text above to see preview' : 'Upload an image to see preview'}
        </p>
      )}
    </div>
  )
}
