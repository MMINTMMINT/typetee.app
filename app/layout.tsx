import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TypeTee - Custom ASCII Art T-Shirts',
  description: 'Design custom ASCII art and text t-shirts with an authentic 1980s computer terminal aesthetic',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
