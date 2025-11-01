// Compact ASCII representations of social media icons
// Designed to be small and display well at typical icon sizes

export const socialIcons = {
  twitter: `
    ╔════╗
    ║ 𝕏  ║
    ╚════╝
  `.trim(),
  
  instagram: `
    ╭────╮
    │ ▣▭ │
    │ ▢▬ │
    ╰────╯
  `.trim(),
  
  tiktok: `
    ┏━━━━┓
    ┃ ▶  ┃
    ┗━━━━┛
  `.trim(),
  
  reddit: `
    ┌────┐
    │ ◉ ◉│
    └────┘
  `.trim(),
}

// Simplified flat versions for better display
export const flatIcons = {
  twitter: '𝕏',
  instagram: '📷',
  tiktok: '▶️',
  reddit: '●',
}

// Pixel art versions using block characters
export const pixelIcons = {
  twitter: `
    ██▀▀██
    ░░██░░
    ██▀▀██
  `.trim().split('\n'),
  
  instagram: `
    ███████
    █▄▄▄▄▄█
    █░▀▀░░█
    █░░▀▀░█
    █▄▄▄▄▄█
  `.trim().split('\n'),
  
  tiktok: `
    ██████
    ░█████
    ░█████
    ██████
  `.trim().split('\n'),
  
  reddit: `
    ░███░
    █░█░█
    █░█░█
    ░███░
  `.trim().split('\n'),
}
