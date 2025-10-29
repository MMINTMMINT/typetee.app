'use client'

import { useDesignStore } from '@/store/designStore'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import sounds from '@/lib/sounds'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const theme = useDesignStore((state) => state.theme)
  const size = useDesignStore((state) => state.size)
  const mode = useDesignStore((state) => state.mode)
  const text = useDesignStore((state) => state.text)
  const asciiArt = useDesignStore((state) => state.asciiArt)
  const font = useDesignStore((state) => state.font)
  const textSize = useDesignStore((state) => state.textSize)
  const placement = useDesignStore((state) => state.placement)
  const soundEnabled = useDesignStore((state) => state.soundEnabled)
  
  const [isLoading, setIsLoading] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })
  
  const bgColor = theme === 'black' ? 'bg-terminal-black' : 'bg-terminal-white'
  const textColor = theme === 'black' ? 'text-terminal-white' : 'text-terminal-black'
  const inputClass = theme === 'black' ? 'retro-input-black' : 'retro-input-white'
  const buttonClass = theme === 'black' ? 'retro-button-black' : 'retro-button-white'
  const panelClass = theme === 'black' ? 'retro-panel-black' : 'retro-panel-white'
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (soundEnabled) {
      sounds.checkout()
    }
    
    setIsLoading(true)
    
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shirtColor: theme,
          size,
          mode,
          text,
          asciiArt,
          font,
          textSize,
          placement,
          shippingInfo,
        }),
      })
      
      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to process checkout. Please try again.')
      setIsLoading(false)
    }
  }
  
  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      <header className="border-b-4 border-current p-4">
        <div className="container mx-auto">
          <a href="/" className="font-pressStart text-xl md:text-2xl hover:opacity-70">
            ← BACK TO DESIGN
          </a>
        </div>
      </header>
      
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <h1 className="font-pressStart text-2xl mb-8">CHECKOUT</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className={`retro-panel ${panelClass}`}>
            <h2 className="font-bold text-xl mb-6">SHIPPING INFORMATION</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold mb-2 text-sm">EMAIL *</label>
                <input
                  type="email"
                  required
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                  className={`${inputClass} retro-input`}
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm">FULL NAME *</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                  className={`${inputClass} retro-input`}
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm">ADDRESS *</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  className={`${inputClass} retro-input`}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2 text-sm">CITY *</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className={`${inputClass} retro-input`}
                  />
                </div>
                
                <div>
                  <label className="block font-bold mb-2 text-sm">STATE *</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                    className={`${inputClass} retro-input`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2 text-sm">ZIP CODE *</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.zip}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                    className={`${inputClass} retro-input`}
                  />
                </div>
                
                <div>
                  <label className="block font-bold mb-2 text-sm">COUNTRY *</label>
                  <select
                    required
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                    className={`${inputClass} retro-input`}
                  >
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`${buttonClass} retro-button w-full py-4 text-xl mt-6 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
              </button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className={`retro-panel ${panelClass}`}>
            <h2 className="font-bold text-xl mb-6">ORDER SUMMARY</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between border-b-2 border-current pb-2">
                <span>T-SHIRT ({theme.toUpperCase()})</span>
                <span>$29.99</span>
              </div>
              
              <div className="flex justify-between border-b-2 border-current pb-2">
                <span>SIZE</span>
                <span>{size}</span>
              </div>
              
              <div className="flex justify-between border-b-2 border-current pb-2">
                <span>PLACEMENT</span>
                <span>{placement.toUpperCase()}</span>
              </div>
              
              <div className="flex justify-between border-b-2 border-current pb-2">
                <span>DESIGN</span>
                <span>{mode.toUpperCase()}</span>
              </div>
              
              <div className="flex justify-between border-b-2 border-current pb-2">
                <span>SHIPPING</span>
                <span>FREE</span>
              </div>
              
              <div className="flex justify-between font-bold text-xl pt-4">
                <span>TOTAL</span>
                <span>$29.99</span>
              </div>
            </div>
            
            <div className="border-[6px] border-current p-4 text-sm">
              <p className="font-bold mb-2">⚠️ IMPORTANT:</p>
              <ul className="list-disc list-inside space-y-1 opacity-90">
                <li>NO REFUNDS on custom orders</li>
                <li>Production time: 3-5 business days</li>
                <li>Shipping: 5-7 business days</li>
                <li>Print quality may vary slightly</li>
              </ul>
              <p className="mt-3">
                By proceeding, you agree to our <a href="/terms" className="underline">Terms & Conditions</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
