'use client'

import { useDesignStore } from '@/store/designStore'
import { useEffect, useRef, useMemo } from 'react'
import { asciiToSvg } from '@/lib/asciiConverter'

interface TShirtPreviewProps {
  canvasBackgroundColor?: string
}

export function TShirtPreview({ canvasBackgroundColor }: TShirtPreviewProps) {
  const theme = useDesignStore((state) => state.theme)
  const mode = useDesignStore((state) => state.mode)
  const text = useDesignStore((state) => state.text)
  const font = useDesignStore((state) => state.font)
  const textSize = useDesignStore((state) => state.textSize)
  const textAlign = useDesignStore((state) => state.textAlign)
  const asciiArt = useDesignStore((state) => state.asciiArt)
  const asciiSize = useDesignStore((state) => state.asciiSize)
  const placement = useDesignStore((state) => state.placement)
  const showAsciiTextOverlay = useDesignStore((state) => state.showAsciiTextOverlay)
  const asciiTextOverlay = useDesignStore((state) => state.asciiTextOverlay)
  const asciiTextPosition = useDesignStore((state) => state.asciiTextPosition)
  const asciiTextBackground = useDesignStore((state) => state.asciiTextBackground)
  const asciiTextFont = useDesignStore((state) => state.asciiTextFont)
  const asciiTextSize = useDesignStore((state) => state.asciiTextSize)
  const asciiTextAlign = useDesignStore((state) => state.asciiTextAlign)
  const asciiTextFitToBox = useDesignStore((state) => state.asciiTextFitToBox)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  
  const fontMap = {
    vt323: 'VT323',
    commodore: '"Commodore 64 Pixelized", monospace',
    pressStart: '"Press Start 2P"',
  }
  
  // Generate SVG for ASCII art
  const asciiSvg = useMemo(() => {
    if (mode !== 'ascii' || !asciiArt) return null
    
  const foregroundColor = theme === 'black' ? '#FFFFFF' : '#000000'
  const backgroundColor = theme === 'black' ? '#121215' : '#FFFFFF'
    
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
    
    // Clear canvas - use the provided background color or default to scrollable panel color
    if (theme === 'white') {
      ctx.fillStyle = '#FFFFFF'
    } else {
      ctx.fillStyle = canvasBackgroundColor || '#18181b'
    }
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
  
  // Render text overlay for ASCII mode
  useEffect(() => {
    const canvas = overlayCanvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    // Only render overlay in ASCII mode when there is text to display
    // Note: showAsciiTextOverlay controls whether the control panel is open,
    // but we should still render the overlay if there's text content
    if (mode !== 'ascii' || !asciiTextOverlay) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }
    
    // Full print area dimensions
    const printWidth = 4606
    const printHeight = 5787
    
    // Scale for display
    const dpr = 2
    const displayWidth = 460
    const displayHeight = 579
    
    // Canvas setup
    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr
    ctx.scale(dpr, dpr)
    ctx.imageSmoothingEnabled = false
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Padding settings (reduced)
    const horizontalPadding = 20
    const verticalPaddingTop = 15
    const verticalPaddingBottom = 2 // Reduced bottom padding
    const maxWidth = displayWidth - horizontalPadding
    
    // Font sizing
    let fontSize = asciiTextSize * 10
    fontSize = Math.max(fontSize, 12)
    fontSize = Math.min(fontSize, 140)
    
    // Line height (reduced from 1.8 to 1.4)
    const lineHeight = fontSize * 1.4
    
    // Handle FIT TO BOX mode
    if (asciiTextFitToBox) {
      // For fit to box, we need to work in the PRINT area coordinate system
      // The overlay is 1050px tall in the print area, but we want it to fit within reasonable bounds
      // Maximum printable overlay height: ~1200px (about 20% of 5787)
      const maxPrintOverlayHeight = 1200
      const maxDisplayOverlayHeight = (maxPrintOverlayHeight / printHeight) * displayHeight
      
      // Use almost full width for fit to box - minimal padding
      const fitToBoxPadding = 5
      const availableWidth = displayWidth - fitToBoxPadding
      const availableHeight = maxDisplayOverlayHeight
      
      let testFontSize = 140
      let bestFontSize = 12
      ctx.textBaseline = 'top'
      
      while (testFontSize >= 12) {
        ctx.font = `900 ${testFontSize}px ${fontMap[asciiTextFont]}`
        ctx.letterSpacing = '-2px'
        
        const testLineHeight = testFontSize * 1.4
        const inputLines = asciiTextOverlay.split('\n')
        let totalLines = 0
        
        for (const inputLine of inputLines) {
          if (inputLine.trim() === '') {
            totalLines++
            continue
          }
          
          const words = inputLine.split(' ')
          let currentLine = ''
          
          for (const word of words) {
            const testLine = currentLine === '' ? word : currentLine + ' ' + word
            const testWidth = ctx.measureText(testLine).width
            
            if (testWidth <= availableWidth || currentLine === '') {
              currentLine = testLine
            } else {
              totalLines++
              currentLine = word
            }
          }
          
          if (currentLine) {
            totalLines++
          }
        }
        
        const totalHeight = totalLines * testLineHeight + verticalPaddingTop + verticalPaddingBottom
        
        if (totalHeight <= availableHeight) {
          bestFontSize = testFontSize
          break
        }
        
        testFontSize -= 2
      }
      
      fontSize = bestFontSize
    }
    
    // Set final font
    ctx.font = `900 ${fontSize}px ${fontMap[asciiTextFont]}`
    ctx.letterSpacing = '-2px'
    ctx.textBaseline = 'top'
    
    // Final line height calculation
    const finalLineHeight = fontSize * 1.4
    
    // Use appropriate padding based on fit to box mode
    const effectivePadding = asciiTextFitToBox ? 5 : horizontalPadding
    const effectiveMaxWidth = displayWidth - effectivePadding
    
    // Word wrap and measure text
    const inputLines = asciiTextOverlay.split('\n')
    const lines: string[] = []
    
    for (const inputLine of inputLines) {
      if (inputLine.trim() === '') {
        lines.push('')
        continue
      }
      
      const words = inputLine.split(' ')
      let currentLine = ''
      
      for (const word of words) {
        const testLine = currentLine === '' ? word : currentLine + ' ' + word
        const testWidth = ctx.measureText(testLine).width
        
        if (testWidth <= effectiveMaxWidth || currentLine === '') {
          currentLine = testLine
        } else {
          if (currentLine) lines.push(currentLine)
          currentLine = word
        }
      }
      
      if (currentLine) {
        lines.push(currentLine)
      }
    }
    
    // Calculate dynamic overlay height based on wrapped text
    const totalHeight = lines.length * finalLineHeight + verticalPaddingTop + verticalPaddingBottom
    const overlayHeight = Math.max(totalHeight, 80) // Minimum height of 80px
    
    // Scale the overlay height from display size to print area size
    const scaledOverlayHeight = (overlayHeight / displayHeight) * printHeight
    
    // Calculate Y position based on position setting
    let yOffset = 0
    if (asciiTextPosition === 'top') {
      yOffset = 0
    } else if (asciiTextPosition === 'middle') {
      yOffset = (printHeight - scaledOverlayHeight) / 2
    } else { // bottom
      yOffset = printHeight - scaledOverlayHeight
    }
    
    // Scale Y offset from print area to display
    const scaledYOffset = (yOffset / printHeight) * displayHeight
    
    // Draw background if solid
    if (asciiTextBackground === 'solid') {
      ctx.fillStyle = theme === 'black' ? '#000000' : '#FFFFFF'
      ctx.fillRect(-50, scaledYOffset - 5, displayWidth + 100, overlayHeight + 10)
    }
    
    // Draw text
    ctx.fillStyle = theme === 'black' ? '#FFFFFF' : '#000000'
    ctx.textAlign = asciiTextAlign
    
    const leftPadding = asciiTextFitToBox ? 2 : 10
    let xPos = leftPadding
    if (asciiTextAlign === 'center') {
      xPos = displayWidth / 2
    } else if (asciiTextAlign === 'right') {
      xPos = displayWidth - leftPadding
    }
    
    // For fit to box, evenly space text vertically
    let drawVerticalPadding = verticalPaddingTop
    if (asciiTextFitToBox && lines.length > 0) {
      // Calculate available height for text
      const availableHeight = overlayHeight - verticalPaddingTop - verticalPaddingBottom
      const totalTextHeight = lines.length * finalLineHeight
      const extraSpace = Math.max(0, availableHeight - totalTextHeight)
      
      // Distribute extra space evenly between lines
      if (extraSpace > 0) {
        drawVerticalPadding = verticalPaddingTop + (extraSpace / (lines.length + 1))
      }
    }
    
    lines.forEach((line, index) => {
      let yPos
      if (asciiTextFitToBox && lines.length > 0) {
        // Evenly distribute lines vertically
        const availableHeight = overlayHeight - verticalPaddingTop - verticalPaddingBottom
        const totalTextHeight = lines.length * finalLineHeight
        const spacing = Math.max(finalLineHeight, availableHeight / lines.length)
        yPos = scaledYOffset + verticalPaddingTop + (index * spacing)
      } else {
        yPos = scaledYOffset + verticalPaddingTop + (index * finalLineHeight)
      }
      ctx.fillText(line, xPos, yPos)
      ctx.fillText(line, xPos + 0.5, yPos)
      ctx.fillText(line, xPos, yPos + 0.5)
    })
  }, [theme, mode, asciiTextOverlay, asciiTextPosition, asciiTextBackground, asciiTextFont, asciiTextSize, asciiTextAlign, asciiTextFitToBox, fontMap])
  
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
                  position: 'relative',
                  overflow: 'clip',
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: asciiSvg }}
                  style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                  }}
                />
                {/* Text Overlay Canvas - positioned to cover entire area */}
                {asciiTextOverlay && (
                  <canvas
                    ref={overlayCanvasRef}
                    className="pixelated"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      imageRendering: 'pixelated',
                      pointerEvents: 'none',
                      display: 'block',
                    }}
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      
      {(!text && !asciiArt) && (
        <p className="text-center mt-6 opacity-70 text-[12px] leading-relaxed">
          {mode === 'text' ? 'Enter text to see preview' : 'Upload an image to see preview'}
        </p>
      )}
    </div>
  )
}
