import sharp from 'sharp'

interface DesignData {
  shirtColor: string
  mode: string
  text: string
  asciiArt: string
  font: string
  textSize: number
  placement: string
}

export async function generateDesignImage(orderData: DesignData): Promise<string> {
  // Canvas dimensions for print (4606x5787px at 300 DPI)
  const width = 4606
  const height = 5787
  
  // Create SVG for the design
  const backgroundColor = orderData.shirtColor === 'black' ? '#000000' : '#FFFFFF'
  const textColor = orderData.shirtColor === 'black' ? '#FFFFFF' : '#000000'
  
  let designContent = ''
  
  if (orderData.mode === 'text' && orderData.text) {
    const fontSize = orderData.textSize * 100 // Scale up for print
    const fontFamily = orderData.font === 'vt323' ? 'VT323' : 
                       orderData.font === 'commodore' ? 'monospace' : 
                       'monospace'
    
    designContent = `
      <text
        x="50%"
        y="50%"
        font-family="${fontFamily}"
        font-size="${fontSize}"
        fill="${textColor}"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        ${escapeXml(orderData.text)}
      </text>
    `
  } else if (orderData.mode === 'ascii' && orderData.asciiArt) {
    // For ASCII art, we need to render each line
    const lines = orderData.asciiArt.split('\n')
    const fontSize = 60 // Monospace size for ASCII
    const lineHeight = fontSize * 1.1
    const startY = (height - lines.length * lineHeight) / 2
    
    designContent = lines.map((line, i) => `
      <text
        x="50%"
        y="${startY + i * lineHeight}"
        font-family="monospace"
        font-size="${fontSize}"
        fill="${textColor}"
        text-anchor="middle"
      >
        ${escapeXml(line)}
      </text>
    `).join('')
  }
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
      ${designContent}
    </svg>
  `
  
  try {
    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer()
    
    // In a real app, you would upload this to a CDN or storage service
    // For now, return a data URL (in production, upload to S3/Cloudinary/etc)
    const base64Image = pngBuffer.toString('base64')
    return `data:image/png;base64,${base64Image}`
  } catch (error) {
    console.error('Error generating design image:', error)
    throw new Error('Failed to generate design image')
  }
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case "'": return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}
