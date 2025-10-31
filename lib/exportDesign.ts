/**
 * Export design as PNG image
 * 4500px x 5100px at 300 DPI
 */

export async function exportDesignAsPNG(
  canvas: HTMLCanvasElement,
  filename: string = 'typetee-design.png'
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Create a link element and trigger download
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Convert canvas to image data URL for processing
 */
export function canvasToImageDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png')
}

/**
 * Get canvas image as Blob for upload
 */
export async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to convert canvas to blob'))
        }
      },
      'image/png',
      1.0
    )
  })
}
