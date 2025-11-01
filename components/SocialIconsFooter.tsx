'use client'

interface SocialIconsFooterProps {
  className?: string
  iconSize?: 'small' | 'medium' | 'large'
  gap?: 'sm' | 'md' | 'lg'
}

export function SocialIconsFooter({ className = '', iconSize = 'small', gap = 'md' }: SocialIconsFooterProps) {
  const sizeMap = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-10 h-10',
  }
  
  const gapMap = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  }
  
  return (
    <div className={`flex items-center justify-center ${gapMap[gap]} ${className}`}>
      <a 
        href="https://www.instagram.com/typetee.app" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`hover:opacity-70 transition-opacity ${sizeMap[iconSize]} flex items-center justify-center`}
        title="Instagram"
      >
        <img src="/instagram.svg" alt="Instagram" className={`${sizeMap[iconSize]}`} />
      </a>
      <a 
        href="https://www.tiktok.com/@typetee.app" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`hover:opacity-70 transition-opacity ${sizeMap[iconSize]} flex items-center justify-center`}
        title="TikTok"
      >
        <img src="/TikTok-Logo.svg" alt="TikTok" className={`${sizeMap[iconSize]}`} />
      </a>
      <a 
        href="https://www.reddit.com/user/typeteeapp/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`hover:opacity-70 transition-opacity ${sizeMap[iconSize]} flex items-center justify-center`}
        title="Reddit"
      >
        <img src="/reddit.svg" alt="Reddit" className={`${sizeMap[iconSize]}`} />
      </a>
      <a 
        href="https://twitter.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`hover:opacity-70 transition-opacity ${sizeMap[iconSize]} flex items-center justify-center`}
        title="Twitter"
      >
        <img src="/x_twitter.svg" alt="Twitter" className={`${sizeMap[iconSize]} invert`} />
      </a>
    </div>
  )
}
