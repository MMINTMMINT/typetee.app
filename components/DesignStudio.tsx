'use client'

import { useDesignStore } from '@/store/designStore'
import { ThemeToggle } from './ThemeToggle'
import { DesignControls } from './DesignControls'
import { TShirtPreview } from './TShirtPreview'
import { CheckoutButton } from './CheckoutButton'
import { PixelLogo } from './PixelLogo'

export function DesignStudio() {
  const theme = useDesignStore((state) => state.theme)
  
  const bgColor = theme === 'black' ? 'bg-terminal-black' : 'bg-terminal-white'
  const textColor = theme === 'black' ? 'text-terminal-white' : 'text-terminal-black'
  
  return (
    <div className={`${bgColor} ${textColor} transition-colors duration-300`}>
      {/* Header - Fixed */}
      <header className="border-b-[6px] border-current p-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4">
          <PixelLogo />
          <ThemeToggle />
        </div>
      </header>
      
      {/* Main Content - Below fixed header */}
      <div className="pt-24">
        <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-8">
          {/* Left: Design Controls - Scrollable with Checkout Button */}
          <div className="flex-1 overflow-y-auto flex flex-col max-h-[calc(100vh-6rem)]">
            <DesignControls />
            <div className="mt-8 flex-shrink-0">
              <CheckoutButton />
            </div>
          </div>
          
          {/* Right: T-Shirt Preview - Fixed to top */}
          <div className="w-full lg:w-1/2 h-fit sticky top-24 flex items-center justify-center">
            <div className="flex items-center justify-center w-full">
              <TShirtPreview />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - At bottom of page */}
      <div className="pb-8"></div>
      
      {/* Footer - At bottom of page */}
      <footer className="border-t-[6px] border-current p-4">
        <div className="text-center text-[10px] leading-relaxed">
          <p className="mb-2">© 2025 TYPETEE.APP - RETRO ASCII T-SHIRTS</p>
          <div className="flex justify-center gap-6">
            <a href="/terms" className="underline hover:opacity-70">TERMS & CONDITIONS</a>
            <a href="/sizing" className="underline hover:opacity-70">SIZING GUIDE</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
