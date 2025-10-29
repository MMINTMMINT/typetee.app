'use client'

import { useDesignStore } from '@/store/designStore'
import { useEffect, useRef } from 'react'

export function PixelLogo() {
  const theme = useDesignStore((state) => state.theme)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const pixelFont: Record<string, number[][]> = {
    'T': [
      [1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0]
    ],
    'y': [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [1,1,0,0,0,0,1,1],
      [1,1,0,0,0,0,1,1],
      [0,1,1,0,0,1,1,0],
      [0,1,1,0,0,1,1,0],
      [0,0,1,1,1,1,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0]
    ],
    'p': [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,0,0],
      [1,1,1,1,1,1,1,0],
      [1,1,0,0,0,1,1,0],
      [1,1,0,0,0,1,1,0],
      [1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,0,0],
      [1,1,0,0,0,0,0,0],
      [1,1,0,0,0,0,0,0]
    ],
    'e': [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,0,0],
      [1,1,1,1,1,1,1,0],
      [1,1,0,0,0,1,1,0],
      [1,1,1,1,1,1,0,0],
      [1,1,1,1,1,1,0,0],
      [1,1,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,0]
    ],
    '.': [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,1,1,0,0,0,0,0],
      [0,1,1,0,0,0,0,0]
    ],
    'a': [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,0,0],
      [1,1,1,1,1,1,1,0],
      [0,0,0,0,0,1,1,0],
      [0,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,0],
      [1,1,0,0,0,1,1,0],
      [1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1]
    ]
  }

  const drawPixelLetter = (
    ctx: CanvasRenderingContext2D, 
    letter: string, 
    x: number, 
    y: number, 
    pixelSize: number,
    isBlack: boolean
  ): number => {
    const pattern = pixelFont[letter]
    if (!pattern) return x

    const letterWidth = pattern[0].length
    const letterHeight = pattern.length

    for (let row = 0; row < letterHeight; row++) {
      for (let col = 0; col < letterWidth; col++) {
        if (pattern[row][col] === 1) {
          // Draw main pixel
          ctx.fillStyle = isBlack ? '#FFFFFF' : '#000000'
          ctx.fillRect(
            x + (col * pixelSize),
            y + (row * pixelSize),
            pixelSize,
            pixelSize
          )
        }
      }
    }

    return x + (letterWidth * pixelSize) + (pixelSize * 2)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const pixelSize = 3 // Smaller for header
    const yPos = 2
    let xPos = 0

    const isBlack = theme === 'black'

    // Draw: TypeTee.app
    xPos = drawPixelLetter(ctx, 'T', xPos, yPos, pixelSize, isBlack)
    xPos = drawPixelLetter(ctx, 'y', xPos, yPos, pixelSize, isBlack)
    xPos = drawPixelLetter(ctx, 'p', xPos, yPos, pixelSize, isBlack)
    xPos = drawPixelLetter(ctx, 'e', xPos, yPos, pixelSize, isBlack)
    xPos = drawPixelLetter(ctx, 'T', xPos, yPos, pixelSize, isBlack)
    xPos = drawPixelLetter(ctx, 'e', xPos, yPos, pixelSize, isBlack)
    xPos = drawPixelLetter(ctx, 'e', xPos, yPos, pixelSize, isBlack)
    xPos = drawPixelLetter(ctx, '.', xPos, yPos, pixelSize, isBlack)
    xPos = drawPixelLetter(ctx, 'a', xPos, yPos, pixelSize, isBlack)
    xPos = drawPixelLetter(ctx, 'p', xPos, yPos, pixelSize, isBlack)
    xPos = drawPixelLetter(ctx, 'p', xPos, yPos, pixelSize, isBlack)
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      width="360"
      height="32"
      className="pixelated"
      style={{
        imageRendering: 'pixelated',
        height: 'clamp(16px, 5vw, 32px)',
        width: 'auto',
      }}
    />
  )
}
