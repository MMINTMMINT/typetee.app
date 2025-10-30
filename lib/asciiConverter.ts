// ASCII character sets for different density levels
const ASCII_CHARS = [
  ['@', '#'],  // Chunky
  ['@', '#', 'S', '%', '?', '*'],  // Light
  ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'],  // Normal
  ['$', '@', 'B', '%', '8', '&', 'W', 'M', '#', '*', 'o', 'a', 'h', 'k', 'b', 'd', 'p', 'q', 'w', 'm'],  // Detailed
  ['$', '@', 'B', '%', '8', '&', 'W', 'M', '#', '*', 'o', 'a', 'h', 'k', 'b', 'd', 'p', 'q', 'w', 'm', 'Z', 'O', '0', 'Q', 'L', 'C', 'J', 'U', 'Y', 'X', 'z', 'c', 'v', 'u', 'n', 'x', 'r', 'j', 'f', 't', '/', '\\', '|', '(', ')', '1', '{', '}', '[', ']', '?', '-', '_', '+', '~', '<', '>', 'i', '!', 'l', 'I', ';', ':', ',', '"', '^', '`', "'", '.', ' '],  // Ultra
]

// ASCII character sets for different styles
const ASCII_STYLE_CHARS: Record<string, string[]> = {
  standard: ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'],
  lineArt: ['/', '\\', '|', '-', '+', '~', '^', 'v', '<', '>', '(', ')'],
  solid: ['█', '▓', '▒', '░', ' '],
  shaded: ['█', '▓', '▒', '░', '·', ' '],
  oldschool: ['▀', '▄', '█', '▌', '▐', '░', '▒', '▓'],
  newschool: ['■', '▪', '▫', '□', '◆', '◇', '●', '○'],
  irc: ['@', '#', '$', '%', '&', '*', '+', '=', '-', '.', ' '],
  typewriter: ['#', '*', '=', '+', '-', '_', '.', ',', ' '],
  emoticon: ['^', '_', '^', 'o', 'O', '~', '-', '.', ' ']
}

// Font mapping for ASCII styles
const ASCII_STYLE_FONTS: Record<string, string> = {
  standard: 'monospace',
  lineArt: 'Courier New, monospace',
  solid: 'JetBrains Mono, monospace',
  shaded: 'Menlo, monospace',
  oldschool: 'Liberation Mono, monospace',
  newschool: 'DejaVu Sans Mono, monospace',
  irc: 'Monaco, monospace',
  typewriter: 'Courier Prime, monospace',
  emoticon: 'Noto Sans Mono, monospace'
}

export async function convertImageToAscii(
  imageDataUrl: string,
  density: number = 2,
  maxWidth: number = 120,
  style: string = 'standard'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      try {
        // Create canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        // Calculate dimensions (maintain aspect ratio)
        const aspectRatio = img.height / img.width
        canvas.width = Math.min(maxWidth, img.width)
        canvas.height = Math.floor(canvas.width * aspectRatio)
        
        // Draw and get image data
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        
        // Convert to ASCII
        // Use style-specific characters if available, otherwise fall back to density-based
        const chars = ASCII_STYLE_CHARS[style] || ASCII_CHARS[density] || ASCII_CHARS[2]
        let ascii = ''
        
        for (let y = 0; y < canvas.height; y += 2) {  // Skip rows for better aspect ratio
          for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4
            const r = imageData.data[i]
            const g = imageData.data[i + 1]
            const b = imageData.data[i + 2]
            
            // Calculate brightness
            const brightness = (r + g + b) / 3
            
            // Map brightness to character
            const charIndex = Math.floor((brightness / 255) * (chars.length - 1))
            ascii += chars[chars.length - 1 - charIndex]  // Invert for proper contrast
          }
          ascii += '\n'
        }
        
        resolve(ascii)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = imageDataUrl
  })
}

export async function generatePrintReadyAscii(
  asciiArt: string,
  width: number = 4606,
  height: number = 5787
): Promise<string> {
  // For print-ready version, scale up the ASCII art
  // This will be used when generating the final PNG for Printify
  return asciiArt
}

export function asciiToSvg(
  asciiArt: string,
  fontSize: number = 12,
  fontFamily: string = 'monospace',
  foregroundColor: string = '#000000',
  backgroundColor: string = '#FFFFFF',
  printWidth: number = 4606,
  printHeight: number = 5787,
  includeBackground: boolean = true,
  style: string = 'standard'
): string {
  const lines = asciiArt.split('\n')
  const charWidth = fontSize * 0.6 // Approximate monospace char width
  const lineHeight = fontSize * 1.2
  
  // Get the appropriate font for the style
  const styleFont = ASCII_STYLE_FONTS[style] || fontFamily
  
  // Calculate content dimensions based on fontSize
  const contentWidth = Math.max(...lines.map(line => line.length)) * charWidth
  const contentHeight = lines.length * lineHeight
  
  // Use fixed viewBox based on print area for consistent scaling
  // This way fontSize changes affect actual size, not just the viewBox
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${printWidth} ${printHeight}" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">`
  
  // Add background only if requested (for previews, not for final export)
  if (includeBackground) {
    svg += `<rect width="${printWidth}" height="${printHeight}" fill="${backgroundColor}"/>`
  }
  
  // Center content horizontally, align to top vertically
  const offsetX = (printWidth - contentWidth) / 2
  const offsetY = 0 // Align to top of print area
  
  lines.forEach((line, y) => {
    const yPos = offsetY + (y + 1) * lineHeight - lineHeight * 0.2 // Adjust baseline
    const xPos = offsetX
    svg += `<text x="${xPos}" y="${yPos}" font-family="${styleFont}" font-size="${fontSize}" fill="${foregroundColor}" style="fill: ${foregroundColor} !important; font-family: ${styleFont};" white-space="pre">${escapeXml(line)}</text>`
  })
  
  svg += '</svg>'
  return svg
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
