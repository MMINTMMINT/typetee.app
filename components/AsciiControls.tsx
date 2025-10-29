'use client'

import { useDesignStore } from '@/store/designStore'
import { useState, useRef } from 'react'
import { convertImageToAscii } from '@/lib/asciiConverter'
import sounds from '@/lib/sounds'

export function AsciiControls() {
  const theme = useDesignStore((state) => state.theme)
  const asciiArt = useDesignStore((state) => state.asciiArt)
  const setAsciiArt = useDesignStore((state) => state.setAsciiArt)
  const asciiDensity = useDesignStore((state) => state.asciiDensity)
  const setAsciiDensity = useDesignStore((state) => state.setAsciiDensity)
  const asciiSize = useDesignStore((state) => state.asciiSize)
  const setAsciiSize = useDesignStore((state) => state.setAsciiSize)
  const uploadedImage = useDesignStore((state) => state.uploadedImage)
  const setUploadedImage = useDesignStore((state) => state.setUploadedImage)
  const artworkAspectRatio = useDesignStore((state) => state.artworkAspectRatio)
  const setArtworkAspectRatio = useDesignStore((state) => state.setArtworkAspectRatio)
  const soundEnabled = useDesignStore((state) => state.soundEnabled)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const inputClass = theme === 'black' ? 'retro-input-black' : 'retro-input-white'
  const buttonClass = theme === 'black' ? 'retro-button-black' : 'retro-button-white'
  
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
          const ascii = await convertImageToAscii(dataUrl, asciiDensity)
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
        const ascii = await convertImageToAscii(uploadedImage, newDensity)
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
                className={`${buttonClass} retro-button text-[10px] py-3 ${
                  asciiDensity === preset.value ? 'active' : ''
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* ASCII Size Slider */}
      {uploadedImage && (
        <div>
          <label className="block font-bold mb-3 text-[10px] leading-relaxed">
            SIZE: {asciiSize.toFixed(1)}
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={asciiSize}
              onChange={(e) => {
                playClick()
                setAsciiSize(parseFloat(e.target.value))
              }}
              className="w-full h-8 appearance-none cursor-pointer"
              style={{
                background: theme === 'black' 
                  ? `linear-gradient(to right, white 0%, white ${(asciiSize / 10) * 100}%, transparent ${(asciiSize / 10) * 100}%, transparent 100%)`
                  : `linear-gradient(to right, black 0%, black ${(asciiSize / 10) * 100}%, transparent ${(asciiSize / 10) * 100}%, transparent 100%)`,
                border: `6px solid ${theme === 'black' ? 'white' : 'black'}`,
              }}
            />
            <div className="flex justify-between text-[8px] leading-relaxed">
              <span>TINY</span>
              <span>HUGE</span>
            </div>
          </div>
        </div>
      )}
      
      {/* ASCII Preview */}
      {asciiArt && (
        <div className="flex flex-col">
          <label className="block font-bold mb-3 text-[10px] leading-relaxed">PREVIEW:</label>
          <div 
            className={`${inputClass.replace('retro-input', 'retro-panel')} overflow-x-auto`}
          >
            <pre 
              className="font-mono text-[6px] leading-[6px] whitespace-pre inline-block min-w-full"
            >
              {asciiArt}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
