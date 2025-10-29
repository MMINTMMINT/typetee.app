'use client'

import { useDesignStore } from '@/store/designStore'

export default function TermsPage() {
  const theme = useDesignStore((state) => state.theme)
  
  const bgColor = theme === 'black' ? 'bg-terminal-black' : 'bg-terminal-white'
  const textColor = theme === 'black' ? 'text-terminal-white' : 'text-terminal-black'
  const panelClass = theme === 'black' ? 'retro-panel-black' : 'retro-panel-white'
  
  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      <header className="border-b-4 border-current p-4">
        <div className="container mx-auto">
          <a href="/" className="font-pressStart text-xl hover:opacity-70">
            ← TYPETEE.APP
          </a>
        </div>
      </header>
      
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className={`retro-panel ${panelClass}`}>
          <h1 className="font-pressStart text-2xl mb-8">TERMS & CONDITIONS</h1>
          
          <div className="space-y-6 font-mono text-sm">
            <section>
              <h2 className="font-bold text-lg mb-3">1. NO REFUNDS POLICY</h2>
              <p>All sales are final. Due to the custom nature of our products, we do not offer refunds or exchanges. Please review your design carefully before completing your purchase.</p>
            </section>
            
            <section>
              <h2 className="font-bold text-lg mb-3">2. PRINT QUALITY DISCLAIMER</h2>
              <p>While we strive for the highest quality prints, some variation in print quality may occur. This includes but is not limited to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Slight color variations from screen display</li>
                <li>Minor positioning differences</li>
                <li>Texture variations in fabric print area</li>
                <li>ASCII art character spacing may vary slightly</li>
              </ul>
            </section>
            
            <section>
              <h2 className="font-bold text-lg mb-3">3. PRODUCTION & SHIPPING</h2>
              <p>Production time is typically 3-5 business days. Shipping times vary by location:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>US: 5-7 business days</li>
                <li>UK: 5-7 business days</li>
                <li>International: 10-14 business days</li>
              </ul>
              <p className="mt-2">We are not responsible for delays caused by shipping carriers or customs.</p>
            </section>
            
            <section>
              <h2 className="font-bold text-lg mb-3">4. CONTENT RESTRICTIONS</h2>
              <p>You may not upload or create designs that contain:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Copyrighted material you do not own</li>
                <li>Offensive, hateful, or illegal content</li>
                <li>Trademarked logos or brand names</li>
                <li>Personal information of others</li>
              </ul>
              <p className="mt-2">We reserve the right to cancel orders that violate these terms.</p>
            </section>
            
            <section>
              <h2 className="font-bold text-lg mb-3">5. PRIVACY & DATA</h2>
              <p>We collect only the information necessary to fulfill your order:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Email address for order confirmation</li>
                <li>Shipping address for delivery</li>
                <li>Payment information (processed securely via Stripe)</li>
              </ul>
              <p className="mt-2">We do not sell or share your personal information. No cookies or tracking technologies are used on this site.</p>
            </section>
            
            <section>
              <h2 className="font-bold text-lg mb-3">6. DAMAGED OR LOST ITEMS</h2>
              <p>If your item arrives damaged or is lost in transit, please contact us at support@typetee.app within 14 days of expected delivery. We will work with our fulfillment partner to resolve the issue.</p>
            </section>
            
            <section>
              <h2 className="font-bold text-lg mb-3">7. MODIFICATIONS TO TERMS</h2>
              <p>We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
            </section>
            
            <section>
              <h2 className="font-bold text-lg mb-3">8. CONTACT</h2>
              <p>For questions about these terms, contact us at:</p>
              <p className="mt-2">Email: support@typetee.app</p>
            </section>
            
            <div className="border-t-4 border-current pt-6 mt-8 text-xs opacity-70">
              <p>Last updated: October 29, 2025</p>
              <p className="mt-2">© 2025 TYPETEE.APP - All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
