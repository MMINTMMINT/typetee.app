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
      // For text mode: use fixed print area ratio
      displayWidth = 230
      displayHeight = 289
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
      ctx.textBaseline = 'middle'
      
      // Calculate optimal font size at textSize = 1 to fit container
      let fontSize: number
      
      if (textSize === 1) {
        // Size 1: Fit text to container - start with a test size
        const testSize = displayHeight * 0.8 // Start with 80% of height
        ctx.font = `900 ${testSize}px ${fontMap[font]}`
        
        // Word wrap to get lines
        const words = text.split(' ')
        const lines: string[] = []
        let currentLine = words[0]
        const maxWidth = displayWidth - 40
        
        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + ' ' + words[i]
          const metrics = ctx.measureText(testLine)
          if (metrics.width > maxWidth) {
            lines.push(currentLine)
            currentLine = words[i]
          } else {
            currentLine = testLine
          }
        }
        lines.push(currentLine)
        
        // Calculate size to fit height
        const lineHeight = testSize * 1.5
        const totalHeight = lines.length * lineHeight
        const fontSizeByHeight = (displayHeight * 0.9 * testSize) / totalHeight
        
        // Calculate size to fit width
        let maxLineWidth = 0
        lines.forEach(line => {
          const metrics = ctx.measureText(line)
          maxLineWidth = Math.max(maxLineWidth, metrics.width)
        })
        const fontSizeByWidth = (maxWidth * testSize) / maxLineWidth
        
        // Use smaller size to fit both dimensions
        fontSize = Math.min(fontSizeByHeight, fontSizeByWidth, testSize)
        fontSize = Math.max(fontSize, 10) // Minimum 10px
      } else {
        // Sizes 2-10: Scale from base size
        fontSize = textSize * 14
      }
      
      ctx.font = `900 ${fontSize}px ${fontMap[font]}` // Weight 900 for extra bold
      
      // Word wrap for long text
      const words = text.split(' ')
      const lines: string[] = []
      let currentLine = words[0]
      
      const maxWidth = displayWidth - 40 // Padding
      
      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i]
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth) {
          lines.push(currentLine)
          currentLine = words[i]
        } else {
          currentLine = testLine
        }
      }
      lines.push(currentLine)
      
      // Draw lines with proper alignment and extra blocky rendering
      const lineHeight = fontSize * 1.5
      const startY = (displayHeight - lines.length * lineHeight) / 2
      
      lines.forEach((line, i) => {
        let xPos: number
        if (textAlign === 'left') {
          xPos = 20
        } else if (textAlign === 'center') {
          xPos = displayWidth / 2
        } else { // right
          xPos = displayWidth - 20
        }
        
        // Draw text multiple times slightly offset for extra bold blocky effect
        ctx.fillText(line, xPos, startY + i * lineHeight)
        ctx.fillText(line, xPos + 0.5, startY + i * lineHeight)
        ctx.fillText(line, xPos, startY + i * lineHeight + 0.5)
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
            src={placement === 'front' ? '/front.png' : '/back.png'}
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
