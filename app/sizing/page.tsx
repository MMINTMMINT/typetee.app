'use client'

import { useDesignStore } from '@/store/designStore'

export default function SizingPage() {
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
          <h1 className="font-pressStart text-2xl mb-8">SIZING GUIDE</h1>
          
          <div className="space-y-8 font-mono">
            <section>
              <h2 className="font-bold text-xl mb-4">UNISEX T-SHIRT MEASUREMENTS</h2>
              <p className="mb-4 text-sm">All measurements in inches. T-shirts are unisex fit.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-[6px] border-current">
                  <thead>
                    <tr className="border-b-4 border-current">
                      <th className="border-r-4 border-current p-3 text-left">SIZE</th>
                      <th className="border-r-4 border-current p-3 text-left">CHEST (IN)</th>
                      <th className="border-r-4 border-current p-3 text-left">LENGTH (IN)</th>
                      <th className="p-3 text-left">SLEEVE (IN)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b-2 border-current">
                      <td className="border-r-4 border-current p-3 font-bold">S</td>
                      <td className="border-r-4 border-current p-3">36-38</td>
                      <td className="border-r-4 border-current p-3">28</td>
                      <td className="p-3">8</td>
                    </tr>
                    <tr className="border-b-2 border-current">
                      <td className="border-r-4 border-current p-3 font-bold">M</td>
                      <td className="border-r-4 border-current p-3">38-40</td>
                      <td className="border-r-4 border-current p-3">29</td>
                      <td className="p-3">8.5</td>
                    </tr>
                    <tr className="border-b-2 border-current">
                      <td className="border-r-4 border-current p-3 font-bold">L</td>
                      <td className="border-r-4 border-current p-3">42-44</td>
                      <td className="border-r-4 border-current p-3">30</td>
                      <td className="p-3">9</td>
                    </tr>
                    <tr className="border-b-2 border-current">
                      <td className="border-r-4 border-current p-3 font-bold">XL</td>
                      <td className="border-r-4 border-current p-3">46-48</td>
                      <td className="border-r-4 border-current p-3">31</td>
                      <td className="p-3">9.5</td>
                    </tr>
                    <tr>
                      <td className="border-r-4 border-current p-3 font-bold">2XL</td>
                      <td className="border-r-4 border-current p-3">50-52</td>
                      <td className="border-r-4 border-current p-3">32</td>
                      <td className="p-3">10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
            <section>
              <h2 className="font-bold text-xl mb-4">HOW TO MEASURE</h2>
              
              <div className="space-y-4">
                <div className="border-[6px] border-current p-4">
                  <h3 className="font-bold mb-2">CHEST:</h3>
                  <p className="text-sm">Measure around the fullest part of your chest, keeping the tape parallel to the floor.</p>
                </div>
                
                <div className="border-[6px] border-current p-4">
                  <h3 className="font-bold mb-2">LENGTH:</h3>
                  <p className="text-sm">Measure from the highest point of the shoulder down to the hem.</p>
                </div>
                
                <div className="border-[6px] border-current p-4">
                  <h3 className="font-bold mb-2">SLEEVE:</h3>
                  <p className="text-sm">Measure from the center back of the neck to the end of the sleeve.</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="font-bold text-xl mb-4">FIT GUIDE</h2>
              
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-bold">UNISEX FIT:</span> These t-shirts have a classic unisex fit. They're not too tight, not too loose.
                </p>
                
                <p>
                  <span className="font-bold">FOR A FITTED LOOK:</span> Consider sizing down
                </p>
                
                <p>
                  <span className="font-bold">FOR A RELAXED LOOK:</span> Order your usual size or size up
                </p>
                
                <p>
                  <span className="font-bold">BETWEEN SIZES?</span> We recommend sizing up for comfort
                </p>
              </div>
            </section>
            
            <section>
              <h2 className="font-bold text-xl mb-4">FABRIC & CARE</h2>
              
              <div className="border-[6px] border-current p-4 space-y-2 text-sm">
                <p><span className="font-bold">MATERIAL:</span> 100% Cotton (Heather colors: 90% Cotton, 10% Polyester)</p>
                <p><span className="font-bold">WEIGHT:</span> 5.3 oz/yd² (180 g/m²)</p>
                <p><span className="font-bold">CARE:</span> Machine wash cold, tumble dry low</p>
                <p><span className="font-bold">PRINT:</span> Direct-to-garment (DTG) printing</p>
              </div>
            </section>
            
            <div className="border-t-4 border-current pt-6 mt-8">
              <p className="text-sm opacity-70">
                ⚠️ PLEASE NOTE: All measurements are approximate and may vary by up to 1 inch.
              </p>
              <p className="text-sm opacity-70 mt-2">
                Still not sure? Contact us at support@typetee.app
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
