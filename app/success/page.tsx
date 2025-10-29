'use client'

import { useDesignStore } from '@/store/designStore'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import sounds from '@/lib/sounds'

function SuccessContent() {
  const theme = useDesignStore((state) => state.theme)
  const soundEnabled = useDesignStore((state) => state.soundEnabled)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  
  // Play success sound on mount
  useEffect(() => {
    if (soundEnabled) {
      sounds.success()
    }
  }, [soundEnabled])
  
  const bgColor = theme === 'black' ? 'bg-terminal-black' : 'bg-terminal-white'
  const textColor = theme === 'black' ? 'text-terminal-white' : 'text-terminal-black'
  const panelClass = theme === 'black' ? 'retro-panel-black' : 'retro-panel-white'
  const buttonClass = theme === 'black' ? 'retro-button-black' : 'retro-button-white'
  
  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      <header className="border-b-4 border-current p-4">
        <div className="container mx-auto">
          <h1 className="font-pressStart text-xl md:text-2xl">TYPETEE.APP</h1>
        </div>
      </header>
      
      <div className="container mx-auto p-4 md:p-8 max-w-3xl">
        <div className={`retro-panel ${panelClass} text-center`}>
          <div className="mb-8">
            <div className="text-6xl mb-4 animate-pulse">✓</div>
            <h1 className="font-pressStart text-3xl mb-4">ORDER CONFIRMED!</h1>
          </div>
          
          <div className="text-left max-w-2xl mx-auto space-y-4 mb-8">
            <p className="text-lg">
              {'>'} THANK YOU FOR YOUR ORDER
            </p>
            
            <p>
              Your custom t-shirt has been sent to production! You'll receive a confirmation email shortly with your order details.
            </p>
            
            <div className="border-[6px] border-current p-4 my-6">
              <p className="font-bold mb-2">WHAT HAPPENS NEXT:</p>
              <div className="space-y-2 text-sm font-mono">
                <p>1. ORDER PROCESSING: 1-2 HOURS</p>
                <p>2. PRODUCTION: 3-5 BUSINESS DAYS</p>
                <p>3. SHIPPING: 5-7 BUSINESS DAYS</p>
                <p>4. DELIVERY: CHECK YOUR MAILBOX!</p>
              </div>
            </div>
            
            {sessionId && (
              <div className="text-sm opacity-70">
                <p>ORDER ID: {sessionId}</p>
              </div>
            )}
            
            <p className="text-sm">
              You will receive tracking information via email once your order ships.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/" className={`${buttonClass} retro-button px-8 py-4 inline-block`}>
              CREATE ANOTHER DESIGN
            </a>
          </div>
          
          <div className="mt-12 pt-8 border-t-4 border-current text-sm opacity-70">
            <p>Questions? Email us at support@typetee.app</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
