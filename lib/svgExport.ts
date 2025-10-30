export function downloadSvg(svgContent: string, filename: string = 'ascii-art.svg'): void {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function copySvgToClipboard(svgContent: string): Promise<void> {
  return navigator.clipboard.writeText(svgContent)
}
