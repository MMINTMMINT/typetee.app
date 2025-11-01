'use client'

import { useDesignStore } from '@/store/designStore'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import sounds from '@/lib/sounds'

export function CheckoutButton() {
  const theme = useDesignStore((state) => state.theme)
  const mode = useDesignStore((state) => state.mode)
  const text = useDesignStore((state) => state.text)
  const asciiArt = useDesignStore((state) => state.asciiArt)
  const soundEnabled = useDesignStore((state) => state.soundEnabled)
  
  const [showSizeSelector, setShowSizeSelector] = useState(false)
  
  const buttonClass = theme === 'black' ? 'retro-button-black' : 'retro-button-white'
  
  const hasDesign = (mode === 'text' && text.trim()) || (mode === 'ascii' && asciiArt.trim())
  
  const handleBuyNow = () => {
    if (soundEnabled) {
      sounds.buyNow()
    }
    if (!hasDesign) {
      alert('Please create a design first!')
      return
    }
    setShowSizeSelector(true)
  }
  
  return (
    <>
      {!showSizeSelector ? (
        <div className="flex justify-center">
          <button
            onClick={handleBuyNow}
            disabled={!hasDesign}
            className={`font-pressStart text-[24px] px-16 py-8 bg-transparent text-[#fe8181] border-[4px] border-[#fe8181] hover:text-white hover:border-white active:bg-[#fe8181]/20 transition-all ${
              !hasDesign ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            BUY NOW - $29.99
          </button>
        </div>
      ) : (
        <SizeSelector onClose={() => setShowSizeSelector(false)} />
      )}
    </>
  )
}

function SizeSelector({ onClose }: { onClose: () => void }) {
  const theme = useDesignStore((state) => state.theme)
  const size = useDesignStore((state) => state.size)
  const setSize = useDesignStore((state) => state.setSize)
  const soundEnabled = useDesignStore((state) => state.soundEnabled)
  const router = useRouter()
  
  const panelClass = theme === 'black' ? 'retro-panel-black' : 'retro-panel-white'
  const buttonClass = theme === 'black' ? 'retro-button-black' : 'retro-button-white'
  
  const sizes = ['S', 'M', 'L', 'XL', '2XL'] as const
  
  const handleContinue = () => {
    if (soundEnabled) {
      sounds.checkout()
    }
    router.push('/checkout')
  }
  
  const handleSizeClick = (s: typeof sizes[number]) => {
    if (soundEnabled) {
      sounds.sizeSelect()
    }
    setSize(s)
  }
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className={`retro-panel ${panelClass} max-w-2xl w-full`}>
        <h2 className="font-pressStart text-[14px] mb-6 leading-relaxed">SELECT SIZE</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => handleSizeClick(s)}
              className={`${buttonClass} retro-button text-[12px] py-4 ${
                size === s ? 'active' : ''
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        
        <div className="mb-6 p-4 border-[6px] border-current">
          <h3 className="font-bold mb-3 text-[10px] leading-relaxed">SIZE GUIDE</h3>
          <div className="text-[9px] space-y-1 font-mono leading-relaxed">
            <div>S: CHEST 36-38"</div>
            <div>M: CHEST 38-40"</div>
            <div>L: CHEST 42-44"</div>
            <div>XL: CHEST 46-48"</div>
            <div>2XL: CHEST 50-52"</div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (soundEnabled) sounds.click()
              onClose()
            }}
            className={`${buttonClass} retro-button flex-1`}
          >
            CANCEL
          </button>
          <button
            onClick={handleContinue}
            className={`${buttonClass} retro-button flex-1`}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  )
}
