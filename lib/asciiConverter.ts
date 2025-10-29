// ASCII character sets for different density levels
const ASCII_CHARS = [
  ['@', '#'],  // Chunky
  ['@', '#', 'S', '%', '?', '*'],  // Light
  ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'],  // Normal
  ['$', '@', 'B', '%', '8', '&', 'W', 'M', '#', '*', 'o', 'a', 'h', 'k', 'b', 'd', 'p', 'q', 'w', 'm'],  // Detailed
  ['$', '@', 'B', '%', '8', '&', 'W', 'M', '#', '*', 'o', 'a', 'h', 'k', 'b', 'd', 'p', 'q', 'w', 'm', 'Z', 'O', '0', 'Q', 'L', 'C', 'J', 'U', 'Y', 'X', 'z', 'c', 'v', 'u', 'n', 'x', 'r', 'j', 'f', 't', '/', '\\', '|', '(', ')', '1', '{', '}', '[', ']', '?', '-', '_', '+', '~', '<', '>', 'i', '!', 'l', 'I', ';', ':', ',', '"', '^', '`', "'", '.', ' '],  // Ultra
]

export async function convertImageToAscii(
  imageDataUrl: string,
  density: number = 2,
  maxWidth: number = 120
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
        const chars = ASCII_CHARS[density] || ASCII_CHARS[2]
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
