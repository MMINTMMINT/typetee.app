'use client'

import { useDesignStore } from '@/store/designStore'
import { useState, useRef, useMemo } from 'react'
import { convertImageToAscii, asciiToSvg } from '@/lib/asciiConverter'
import { downloadSvg } from '@/lib/svgExport'
import sounds from '@/lib/sounds'

export function AsciiControls() {
  const theme = useDesignStore((state) => state.theme)
  const asciiArt = useDesignStore((state) => state.asciiArt)
  const setAsciiArt = useDesignStore((state) => state.setAsciiArt)
  const asciiDensity = useDesignStore((state) => state.asciiDensity)
  const setAsciiDensity = useDesignStore((state) => state.setAsciiDensity)
  const asciiSize = useDesignStore((state) => state.asciiSize)
  const setAsciiSize = useDesignStore((state) => state.setAsciiSize)
  const asciiStyle = useDesignStore((state) => state.asciiStyle)
  const setAsciiStyle = useDesignStore((state) => state.setAsciiStyle)
  const uploadedImage = useDesignStore((state) => state.uploadedImage)
  const setUploadedImage = useDesignStore((state) => state.setUploadedImage)
  const artworkAspectRatio = useDesignStore((state) => state.artworkAspectRatio)
  const setArtworkAspectRatio = useDesignStore((state) => state.setArtworkAspectRatio)
  const soundEnabled = useDesignStore((state) => state.soundEnabled)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const inputClass = theme === 'black' ? 'retro-input-black' : 'retro-input-white'
  const buttonClass = theme === 'black' ? 'retro-button-black' : 'retro-button-white'
  
  // Generate SVG for ASCII art preview - at 100% or larger depending on asciiSize
  const asciiSvgPreview = useMemo(() => {
    if (!asciiArt) return null
    const foregroundColor = theme === 'black' ? '#FFFFFF' : '#000000'
    const backgroundColor = theme === 'black' ? '#000000' : '#FFFFFF'
    
    // Use same calculation as TShirtPreview for consistency
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
    
    // For preview: show at 100% minimum, but scale up for 120% and 140%
    // For sizes less than or equal to 100% (asciiSize <= 5), use maxFontSize
    // For sizes greater than 100% (asciiSize > 5), scale up to show cropped version
    let fontSize: number
    if (asciiSize <= 5) {
      fontSize = maxFontSize // Always 100% for 40%, 60%, 80%, 100%
    } else {
      // For 120% and 140%, scale up to show the cropped version
      const scale = (asciiSize / 5)
      fontSize = maxFontSize * scale
    }
    
    // includeBackground=true for preview visibility
    return asciiToSvg(asciiArt, fontSize, 'monospace', foregroundColor, backgroundColor, printWidth, printHeight, true, asciiStyle)
  }, [asciiArt, theme, asciiSize, asciiStyle])
  
  // Generate SVG for export - uses the selected size from asciiSize buttons
  const asciiSvg = useMemo(() => {
    if (!asciiArt) return null
    const foregroundColor = theme === 'black' ? '#FFFFFF' : '#000000'
    const backgroundColor = theme === 'black' ? '#000000' : '#FFFFFF'
    
    const lines = asciiArt.split('\n')
    const maxLineLength = Math.max(...lines.map(line => line.length))
    const numLines = lines.length
    
    const printWidth = 4606
    const printHeight = 5787
    
    const charWidthRatio = 0.6
    const lineHeightRatio = 1.2
    
    const maxFontSizeByWidth = printWidth / (maxLineLength * charWidthRatio)
    const maxFontSizeByHeight = printHeight / (numLines * lineHeightRatio)
    const maxFontSize = Math.min(maxFontSizeByWidth, maxFontSizeByHeight)
    
    // For export, use asciiSize to scale from 40% to 140%
    const scale = (asciiSize / 5)
    const fontSize = maxFontSize * scale
    
    // includeBackground=true for preview visibility
    return asciiToSvg(asciiArt, fontSize, 'monospace', foregroundColor, backgroundColor, printWidth, printHeight, true, asciiStyle)
  }, [asciiArt, theme, asciiSize, asciiStyle])
  
  const playClick = () => {
    if (soundEnabled) {
      sounds.click()
    }
  }
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WEBP)')
      return
    }
    
    // Check file size (max 50MB for mobile camera uploads)
    if (file.size > 50 * 1024 * 1024) {
      alert('Image too large. Maximum size is 50MB')
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Read image as data URL
      const reader = new FileReader()
      reader.onload = async (event) => {
        let dataUrl = event.target?.result as string
        
        // Resize image if needed
        const img = new Image()
        img.onload = async () => {
          // Define max dimensions for Printify print area (4606 x 5787)
          const MAX_WIDTH = 4606
          const MAX_HEIGHT = 5787
          
          // Check if image needs resizing
          if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
            // Calculate new dimensions while maintaining aspect ratio
            let newWidth = img.width
            let newHeight = img.height
            
            if (img.width > MAX_WIDTH) {
              const ratio = MAX_WIDTH / img.width
              newWidth = MAX_WIDTH
              newHeight = Math.floor(img.height * ratio)
            }
            
            if (newHeight > MAX_HEIGHT) {
              const ratio = MAX_HEIGHT / newHeight
              newHeight = MAX_HEIGHT
              newWidth = Math.floor(newWidth * ratio)
            }
            
            // Create canvas and resize
            const canvas = document.createElement('canvas')
            canvas.width = newWidth
            canvas.height = newHeight
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(img, 0, 0, newWidth, newHeight)
              // Use lower quality compression for mobile uploads to reduce file size
              dataUrl = canvas.toDataURL('image/jpeg', 0.85)
            }
          }
          
          setUploadedImage(dataUrl)
          
          // Calculate aspect ratio from resized image
          const aspectRatio = img.height / img.width
          setArtworkAspectRatio(aspectRatio)
          
          // Convert to ASCII
          const ascii = await convertImageToAscii(dataUrl, asciiDensity, 120, asciiStyle)
          setAsciiArt(ascii)
          setIsProcessing(false)
          
          // Play upload complete sound
          if (soundEnabled) {
            sounds.uploadComplete()
          }
        }
        img.src = dataUrl
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Failed to process image')
      setIsProcessing(false)
    }
  }
  
  const handleDensityChange = async (newDensity: number) => {
    playClick()
    setAsciiDensity(newDensity)
    
    if (uploadedImage) {
      setIsProcessing(true)
      try {
        const ascii = await convertImageToAscii(uploadedImage, newDensity, 120, asciiStyle)
        setAsciiArt(ascii)
      } catch (error) {
        console.error('Error converting image:', error)
      }
      setIsProcessing(false)
    }
  }
  
  const handleStyleChange = async (newStyle: string) => {
    playClick()
    setAsciiStyle(newStyle as any)
    
    if (uploadedImage) {
      setIsProcessing(true)
      try {
        const ascii = await convertImageToAscii(uploadedImage, asciiDensity, 120, newStyle)
        setAsciiArt(ascii)
      } catch (error) {
        console.error('Error converting image:', error)
      }
      setIsProcessing(false)
    }
  }
  
  const densityPresets = [
    { value: 0, label: 'CHUNKY' },
    { value: 1, label: 'LIGHT' },
    { value: 2, label: 'NORMAL' },
    { value: 3, label: 'DETAILED' },
    { value: 4, label: 'ULTRA' },
  ]
  
  const stylePresets = [
    { 
      value: 'standard', 
      label: 'STANDARD',
      font: 'monospace',
      charSample: `@ # $ % ^ & * ( ) - = +\n+ - = ( ) * & ^ % $ # @\n@ # $ % ^ & * ( ) - = +\n+ - = ( ) * & ^ % $ # @\n@ # $ % ^ & * ( ) - = +\n+ - = ( ) * & ^ % $ # @\n@ # $ % ^ & * ( ) - = +\n+ - = ( ) * & ^ % $ # @\n@ # $ % ^ & * ( ) - = +\n+ - = ( ) * & ^ % $ # @` 
    },
    { 
      value: 'lineArt', 
      label: 'LINE ART',
      font: 'Courier New, monospace',
      charSample: `/ | \\ - + / | \\ - + / | \\\n\\ - + / | \\ - + / | \\ - +\n/ | \\ - + / | \\ - + / | \\\n\\ - + / | \\ - + / | \\ - +\n/ | \\ - + / | \\ - + / | \\\n\\ - + / | \\ - + / | \\ - +\n/ | \\ - + / | \\ - + / | \\\n\\ - + / | \\ - + / | \\ - +\n/ | \\ - + / | \\ - + / | \\\n\\ - + / | \\ - + / | \\ - +` 
    },
    { 
      value: 'solid', 
      label: 'SOLID',
      font: 'JetBrains Mono, monospace',
      charSample: `█ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄\n▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀\n█ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄\n▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀\n█ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄\n▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀\n█ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄\n▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀\n█ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄\n▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀` 
    },
    { 
      value: 'shaded', 
      label: 'SHADED',
      font: 'Menlo, monospace',
      charSample: `▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░\n░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒\n▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░\n░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒\n▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░\n░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒\n▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░\n░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒\n▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░\n░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒ ░ ▓ ▒` 
    },
    { 
      value: 'oldschool', 
      label: 'OLDSCHOOL',
      font: 'Liberation Mono, monospace',
      charSample: `▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █\n█ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄\n▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀\n▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █\n█ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄\n▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀\n▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █\n█ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄\n▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀\n▀ ▄ █ ▀ ▄ █ ▀ ▄ █ ▀ ▄ █` 
    },
    { 
      value: 'newschool', 
      label: 'NEWSCHOOL',
      font: 'DejaVu Sans Mono, monospace',
      charSample: `■ ◆ ● ■ ◆ ● ■ ◆ ● ■ ◆ ●\n● ■ ◆ ● ■ ◆ ● ■ ◆ ● ■ ◆\n■ ◆ ● ■ ◆ ● ■ ◆ ● ■ ◆ ●\n● ■ ◆ ● ■ ◆ ● ■ ◆ ● ■ ◆\n■ ◆ ● ■ ◆ ● ■ ◆ ● ■ ◆ ●\n● ■ ◆ ● ■ ◆ ● ■ ◆ ● ■ ◆\n■ ◆ ● ■ ◆ ● ■ ◆ ● ■ ◆ ●\n● ■ ◆ ● ■ ◆ ● ■ ◆ ● ■ ◆\n■ ◆ ● ■ ◆ ● ■ ◆ ● ■ ◆ ●\n● ■ ◆ ● ■ ◆ ● ■ ◆ ● ■ ◆` 
    },
    { 
      value: 'irc', 
      label: 'IRC CHAT',
      font: 'Monaco, monospace',
      charSample: `# @ * # @ * # @ * # @ * #\n* # @ * # @ * # @ * # @ *\n# @ * # @ * # @ * # @ * #\n* # @ * # @ * # @ * # @ *\n# @ * # @ * # @ * # @ * #\n* # @ * # @ * # @ * # @ *\n# @ * # @ * # @ * # @ * #\n* # @ * # @ * # @ * # @ *\n# @ * # @ * # @ * # @ * #\n* # @ * # @ * # @ * # @ *` 
    },
    { 
      value: 'typewriter', 
      label: 'TYPEWRITER',
      font: 'Courier Prime, monospace',
      charSample: `# @ $ # @ $ # @ $ # @ $ #\n$ # @ $ # @ $ # @ $ # @ $\n# @ $ # @ $ # @ $ # @ $ #\n$ # @ $ # @ $ # @ $ # @ $\n# @ $ # @ $ # @ $ # @ $ #\n$ # @ $ # @ $ # @ $ # @ $\n# @ $ # @ $ # @ $ # @ $ #\n$ # @ $ # @ $ # @ $ # @ $\n# @ $ # @ $ # @ $ # @ $ #\n$ # @ $ # @ $ # @ $ # @ $` 
    },
    { 
      value: 'emoticon', 
      label: 'EMOTICON',
      font: 'Noto Sans Mono, monospace',
      charSample: `:) :( :D :P :) :( :D :P :) :( :D :P\n:P :) :( :D :P :) :( :D :P :) :( :D\n:) :( :D :P :) :( :D :P :) :( :D :P\n:P :) :( :D :P :) :( :D :P :) :( :D\n:) :( :D :P :) :( :D :P :) :( :D :P\n:P :) :( :D :P :) :( :D :P :) :( :D\n:) :( :D :P :) :( :D :P :) :( :D :P\n:P :) :( :D :P :) :( :D :P :) :( :D\n:) :( :D :P :) :( :D :P :) :( :D :P\n:P :) :( :D :P :) :( :D :P :) :( :D` 
    },
  ]
  
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Image Upload */}
      <div>
        <label className="block font-bold mb-3 text-[10px] leading-relaxed">UPLOAD IMAGE:</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => {
            playClick()
            fileInputRef.current?.click()
          }}
          disabled={isProcessing}
          className={`${buttonClass} retro-button w-full ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? 'PROCESSING...' : uploadedImage ? 'CHANGE IMAGE' : 'SELECT IMAGE'}
        </button>
        <p className="text-[8px] mt-2 opacity-70 leading-relaxed">
          JPG, PNG, WEBP (MAX 10MB)
        </p>
      </div>
      
      {/* ASCII Preview */}
      {asciiArt && (
        <div className="flex flex-col gap-2">
          <label className="block font-bold mb-3 text-[10px] leading-relaxed">PREVIEW:</label>
          
          {/* SVG Preview - Shows full artwork at full size */}
          {asciiSvgPreview && (
            <div 
              className={`${inputClass.replace('retro-input', 'retro-panel')} p-4 flex justify-center items-start overflow-x-auto`}
              style={{ 
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: asciiSvgPreview }}
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Density Selection */}
      {uploadedImage && (
        <div>
          <label className="block font-bold mb-3 text-[10px] leading-relaxed">DENSITY:</label>
          <div className="grid grid-cols-2 gap-2">
            {densityPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleDensityChange(preset.value)}
                disabled={isProcessing}
                className={`${buttonClass} retro-button text-[11px] py-3 px-2 ${
                  asciiDensity === preset.value ? 'active' : ''
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Style Selection */}
      {uploadedImage && (
        <div>
          <label className="block font-bold mb-3 text-[10px] leading-relaxed">STYLE:</label>
          <div className="grid grid-cols-2 gap-2">
            {stylePresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleStyleChange(preset.value)}
                disabled={isProcessing}
                className={`${buttonClass} retro-button flex flex-col items-center justify-center gap-2 py-5 px-4 min-h-[100px] ${
                  asciiStyle === preset.value ? 'active' : ''
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-[13px] font-bold">{preset.label}</div>
                <div className={`text-[8px] font-bold style-${preset.value} tracking-tight`}>{preset.charSample.split('\n')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* ASCII Size Buttons */}
      {uploadedImage && (
        <div>
          <label className="block font-bold mb-3 text-[10px] leading-relaxed">
            SIZE:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 2, label: '40%' },
              { value: 3, label: '60%' },
              { value: 4, label: '80%' },
              { value: 5, label: '100%' },
              { value: 6, label: '120%' },
              { value: 7, label: '140%' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => {
                  playClick()
                  setAsciiSize(value)
                }}
                className={`${buttonClass} retro-button text-[10px] py-3 px-2 ${asciiSize === value ? 'active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Export Buttons */}
      {asciiArt && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              playClick()
              if (asciiSvg) {
                downloadSvg(asciiSvg, 'ascii-art.svg')
              }
            }}
            className={`${buttonClass} retro-button text-[8px] py-2`}
          >
            EXPORT SVG
          </button>
          <button
            onClick={() => {
              playClick()
              // Copy SVG to clipboard
              if (asciiSvg) {
                navigator.clipboard.writeText(asciiSvg).then(() => {
                  alert('SVG copied to clipboard!')
                })
              }
            }}
            className={`${buttonClass} retro-button text-[8px] py-2`}
          >
            COPY SVG
          </button>
        </div>
      )}
    </div>
  )
}
