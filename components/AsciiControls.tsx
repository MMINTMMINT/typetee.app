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
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image too large. Maximum size is 10MB')
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Read image as data URL
      const reader = new FileReader()
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string
        setUploadedImage(dataUrl)
        
        // Calculate aspect ratio from image
        const img = new Image()
        img.onload = () => {
          const ratio = img.height / img.width
          setArtworkAspectRatio(ratio)
        }
        img.src = dataUrl
        
        // Convert to ASCII
        const ascii = await convertImageToAscii(dataUrl, asciiDensity)
        setAsciiArt(ascii)
        setIsProcessing(false)
        
        // Play upload complete sound
        if (soundEnabled) {
          sounds.uploadComplete()
        }
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
        <div className="flex flex-col flex-1">
          <label className="block font-bold mb-3 text-[10px] leading-relaxed">PREVIEW:</label>
          <div 
            className={`${inputClass.replace('retro-input', 'retro-panel')} overflow-auto flex items-center justify-center flex-1 w-full`}
            style={artworkAspectRatio ? { aspectRatio: artworkAspectRatio } : {}}
          >
            <pre 
              className="font-mono text-[6px] leading-[6px] w-full h-full flex items-center justify-center"
            >
              {asciiArt}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
