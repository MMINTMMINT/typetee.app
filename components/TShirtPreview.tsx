'use client'

import { useDesignStore } from '@/store/designStore'
import { useEffect, useRef } from 'react'

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
  
  // Update canvas with design
  useEffect(() => {
    const canvas = canvasRef.current
      // Split into lines and trim leading/trailing empty rows and columns so
      // the visible content anchors to the top without invisible padding.
      const rawLines = asciiArt.split('\n')
            
      // Find top and bottom rows that contain at least one non-space char
      let topRow = 0
      while (topRow < rawLines.length && rawLines[topRow].trim().length === 0) topRow++
      let bottomRow = rawLines.length - 1
      while (bottomRow >= topRow && rawLines[bottomRow].trim().length === 0) bottomRow--
            
      const croppedRows = rawLines.slice(topRow, bottomRow + 1)
            
      // Determine leftmost and rightmost non-space columns across all rows
      let leftCol = Infinity
      let rightCol = -1
      for (const row of croppedRows) {
        // Skip fully empty rows (already trimmed above, but defensively)
        if (row.trim().length === 0) continue
        const firstIdx = row.search(/\S/)
        const lastIdx = row.lastIndexOf(row.trim().slice(-1))
        if (firstIdx !== -1) leftCol = Math.min(leftCol, firstIdx)
        if (lastIdx !== -1) rightCol = Math.max(rightCol, lastIdx)
      }
      // Fallback to no column crop if nothing found
      if (!isFinite(leftCol) || rightCol < leftCol) {
        leftCol = 0
        rightCol = (croppedRows[0] ?? '').length - 1
      }
      const lines = croppedRows.map((row) => row.slice(leftCol, rightCol + 1))
    
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    // Set canvas size based on mode
    let displayWidth: number
    let displayHeight: number
    
    if (mode === 'ascii' && asciiArt) {
      // For ASCII: canvas should match the artwork's aspect ratio
      // Calculate aspect ratio from the trimmed ASCII content
      const lines = rawLines.slice(topRow, bottomRow + 1).map((row) => row.slice(leftCol, rightCol + 1))
      const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b, '')
      
      // Measure actual dimensions at a test size
      const testSize = 100
      ctx.font = `bold ${testSize}px monospace`
      const artworkWidth = ctx.measureText(longestLine).width
      const artworkHeight = lines.length * testSize * 1.2
      const artworkRatio = artworkWidth / artworkHeight
      
      // Print area constraints (4606 x 5787)
      const printAreaRatio = 4606 / 5787
      const maxWidth = 460
      const maxHeight = 579
      
      // Size canvas to match artwork ratio within print area bounds
      if (artworkRatio > printAreaRatio) {
        // Artwork is wider than print area - constrain by width
        displayWidth = maxWidth
        displayHeight = maxWidth / artworkRatio
      } else {
        // Artwork is taller than print area - constrain by height
        displayHeight = maxHeight
        displayWidth = maxHeight * artworkRatio
      }
    } else {
      // For text mode: use same print area ratio as ASCII (4606 x 5787)
      const printAreaRatio = 4606 / 5787
      const maxWidth = 460
      const maxHeight = 579
      // Text uses full print area
      displayWidth = maxWidth
      displayHeight = maxHeight
    }
    
    canvas.width = displayWidth
    canvas.height = displayHeight
    
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
      
      // Base sizing: textSize * 14 (size 2 = 28px, size 3 = 42px, etc)
      // Size 1 should be smaller than size 2
      fontSize = textSize * 14
      
      // Ensure size stays within reasonable bounds
      fontSize = Math.max(fontSize, 12) // Minimum 12px
      fontSize = Math.min(fontSize, 180) // Maximum 180px
      
      ctx.font = `900 ${fontSize}px ${fontMap[font]}` // Weight 900 for extra bold
      
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
        
        for (const word of words) {
          if (currentLine === '') {
            // Start a new line with this word
            currentLine = word
          } else {
            // Try adding word to current line
            const testLine = currentLine + ' ' + word
            const testWidth = ctx.measureText(testLine).width
            
            if (testWidth <= maxWidth) {
              // Fits!
              currentLine = testLine
            } else {
              // Doesn't fit - push current line and start new one
              if (currentLine.length > 0) {
                lines.push(currentLine)
              }
              currentLine = word
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
  } else if (mode === 'ascii' && asciiArt) {
      ctx.imageSmoothingEnabled = false
      ctx.fillStyle = theme === 'black' ? '#FFFFFF' : '#000000'
      
      const lines = asciiArt.split('\n')
      
      // Find the longest line
      const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b, '')
      
      // Calculate font size based on asciiSize
      let baseFontSize: number
      
      // Test with a reference size to measure the actual rendered dimensions
      const testFontSize = 100
      ctx.font = `bold ${testFontSize}px monospace`
      
      // Measure the actual width of the longest line at test size
      const testWidth = ctx.measureText(longestLine).width
      const testHeight = lines.length * testFontSize * 1.2
      
      // Calculate scaling factors to fit within display dimensions
      const scaleForWidth = displayWidth / testWidth
      const scaleForHeight = displayHeight / testHeight
      
      // Use the smaller scale to ensure entire artwork fits without cropping
      const fitScale = Math.min(scaleForWidth, scaleForHeight)
      
      // Calculate the base fit size (size 5.0 = 100% fit)
      const baseFitSize = testFontSize * fitScale
      
      // Scale based on asciiSize (0.1 to 10)
      // 5.0 = 100% fit, <5.0 = smaller, >5.0 = larger
      baseFontSize = baseFitSize * (asciiSize / 5.0)
      
      baseFontSize = Math.max(baseFontSize, 4) // Minimum 4px
      
      ctx.font = `bold ${baseFontSize}px monospace`
      ctx.textAlign = 'center' // ASCII art is always centered horizontally
      ctx.textBaseline = 'top'
      
      const lineHeight = baseFontSize * 1.2
      // Top-align the artwork within the print area
      const startY = 0
      
      lines.forEach((line, i) => {
        const yPos = startY + i * lineHeight
        // Draw twice for extra bold effect
        ctx.fillText(line, displayWidth / 2, yPos)
        ctx.fillText(line, displayWidth / 2 + 0.5, yPos)
      })
    }
  }, [theme, mode, text, font, textSize, textAlign, asciiArt, asciiSize])
  
  return (
    <div className="p-4 w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full max-w-full">
        {/* T-Shirt Image */}
        <div className="relative">
          <img
            src={placement === 'front' ? '/front.webp' : '/back.webp'}
            alt={`T-Shirt ${placement}`}
            className="w-full h-auto pixelated"
            style={{
              imageRendering: 'pixelated',
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
