'use client'

import { useDesignStore } from '@/store/designStore'
import { useRef } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { SoundToggle } from './SoundToggle'
import { DesignControls } from './DesignControls'
import { TShirtPreview } from './TShirtPreview'
import { CheckoutButton } from './CheckoutButton'
import { PixelLogo } from './PixelLogo'
import { SocialIconsFooter } from './SocialIconsFooter'

export function DesignStudio() {
  const theme = useDesignStore((state) => state.theme)
  const rightPanelRef = useRef<HTMLDivElement>(null)
  
  const bgColor = theme === 'black' ? 'bg-terminal-black' : 'bg-terminal-white'
  const textColor = theme === 'black' ? 'text-terminal-white' : 'text-terminal-black'
  
  const handleLeftPanelScroll = (e: React.WheelEvent) => {
    if (rightPanelRef.current) {
      rightPanelRef.current.scrollTop += e.deltaY
      e.preventDefault()
    }
  }
  
  return (
    <div className={`transition-colors duration-300 w-full h-screen overflow-hidden`}>
      {/* Main Content - Desktop: Split, Mobile: Mobile layout below header */}
      <div className="flex flex-col xl:flex-row w-full h-screen">
        {/* Left Column: Fixed and static on desktop - hidden on mobile */}
        <div 
          className="hidden xl:flex flex-col items-center justify-between text-terminal-white w-1/2 px-4 py-8 overflow-hidden" 
          style={{ backgroundColor: '#121215' }}
          onWheel={handleLeftPanelScroll}
        >
          {/* Top: Logo, Sound, Theme */}
          <div className="w-full flex items-center justify-between border-b-[3px] border-terminal-accent pb-4">
            <PixelLogo />
            <div className="flex items-center gap-2">
              <SoundToggle />
              <ThemeToggle />
            </div>
          </div>
          
          {/* Middle: T-Shirt Preview (smaller) */}
          <div className="flex-1 w-full flex items-center justify-center py-4">
            <div className="w-full">
              <TShirtPreview canvasBackgroundColor="#121215" />
            </div>
          </div>
          
          {/* Bottom: Small Footer with Social Icons */}
          <div className="w-full pt-4 border-t-[3px] border-terminal-accent">
          </div>
        </div>
        
        {/* Mobile: Stacked layout with menu bar at top */}
        <div className="flex flex-col w-full xl:hidden h-screen">
          {/* Fixed Header */}
          <header className="w-full flex items-center h-[56px] px-3 gap-2 flex-shrink-0" style={{ backgroundColor: '#121215' }}>
            <PixelLogo />
            <div className="flex items-center gap-2 flex-shrink-0 h-full ml-auto">
              <SoundToggle />
              <ThemeToggle />
            </div>
          </header>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto flex flex-col bg-[#18181b] text-terminal-white py-4">
            {/* T-Shirt Preview */}
            <div className="flex justify-center mb-4 w-full">
              <div className="w-full">
                <TShirtPreview canvasBackgroundColor="#18181b" />
              </div>
            </div>
            
            {/* Design Controls */}
            <div className="flex-1 px-4">
              <DesignControls />
            </div>
            
            {/* Buy Button */}
            <div className="mt-8 pt-8 flex-shrink-0 border-t-[3px] border-t-accent-glow px-4">
              <CheckoutButton />
            </div>
            
            {/* Footer */}
            <footer className="border-t-[3px] border-t-accent-glow p-4 mt-8">
              <div className="text-center text-[12px] leading-relaxed">
                <p className="mb-2">© 2025 TYPETEE.APP - RETRO ASCII T-SHIRTS</p>
                <div className="flex justify-center gap-6 mb-4">
                  <a href="/terms" className="underline hover:opacity-70">TERMS & CONDITIONS</a>
                  <a href="/sizing" className="underline hover:opacity-70">SIZING GUIDE</a>
                </div>
                <SocialIconsFooter iconSize="small" gap="md" />
              </div>
            </footer>
          </div>
        </div>

        {/* Right Column: Scrollable, slightly off-black bg */}
        <div ref={rightPanelRef} className="w-full xl:w-1/2 flex flex-col bg-[#18181b] text-terminal-white overflow-y-auto h-screen px-4 py-8">
          <div className="flex-1 flex flex-col">
            <DesignControls />
            <div className="mt-8 pt-8 flex-shrink-0 border-t-[3px] border-t-accent-glow">
              <CheckoutButton />
            </div>
          </div>
          <footer className="border-t-[3px] border-t-accent-glow p-4 mt-8">
            <div className="text-center text-[12px] leading-relaxed">
              <p className="mb-2">© 2025 TYPETEE.APP - RETRO ASCII T-SHIRTS</p>
              <div className="flex justify-center gap-6 mb-4">
                <a href="/terms" className="underline hover:opacity-70">TERMS & CONDITIONS</a>
                <a href="/sizing" className="underline hover:opacity-70">SIZING GUIDE</a>
              </div>
              <SocialIconsFooter iconSize="small" gap="md" />
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
