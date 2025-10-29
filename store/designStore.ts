import { create } from 'zustand'

export type ShirtColor = 'black' | 'white'
export type Placement = 'front' | 'back'
export type Font = 'commodore' | 'vt323' | 'pressStart'
export type DesignMode = 'text' | 'ascii'
export type TShirtSize = 'S' | 'M' | 'L' | 'XL' | '2XL'
export type TextAlign = 'left' | 'center' | 'right'

export interface DesignState {
  // Theme (controls both UI and shirt color)
  theme: ShirtColor
  toggleTheme: () => void
  setTheme: (theme: ShirtColor) => void
  
  // Design mode
  mode: DesignMode
  setMode: (mode: DesignMode) => void
  
  // Text design
  text: string
  setText: (text: string) => void
  font: Font
  setFont: (font: Font) => void
  textSize: number
  setTextSize: (size: number) => void
  textAlign: TextAlign
  setTextAlign: (align: TextAlign) => void
  
  // ASCII design
  asciiArt: string
  setAsciiArt: (art: string) => void
  asciiDensity: number
  setAsciiDensity: (density: number) => void
  asciiSize: number
  setAsciiSize: (size: number) => void
  uploadedImage: string | null
  setUploadedImage: (image: string | null) => void
  artworkAspectRatio: number | null
  setArtworkAspectRatio: (ratio: number | null) => void
  
  // Placement
  placement: Placement
  setPlacement: (placement: Placement) => void
  
  // Product options
  size: TShirtSize
  setSize: (size: TShirtSize) => void
  
  // Sound effects
  soundEnabled: boolean
  toggleSound: () => void
  
  // Reset
  reset: () => void
}

const initialState = {
  theme: 'black' as ShirtColor,
  mode: 'text' as DesignMode,
  text: '',
  font: 'pressStart' as Font,
  textSize: 5,
  textAlign: 'left' as TextAlign,
  asciiArt: '',
  asciiDensity: 2,
  uploadedImage: null,
  placement: 'front' as Placement,
  size: 'M' as TShirtSize,
  soundEnabled: true,
  asciiSize: 5,
  artworkAspectRatio: null,
}

export const useDesignStore = create<DesignState>((set) => ({
  ...initialState,
  
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'black' ? 'white' : 'black'
  })),
  
  setTheme: (theme) => set({ theme }),
  
  setMode: (mode) => set({ mode }),
  
  setText: (text) => set({ text }),
  setFont: (font) => set({ font }),
  setTextSize: (textSize) => set({ textSize }),
  setTextAlign: (textAlign) => set({ textAlign }),
  
  setAsciiArt: (asciiArt) => set({ asciiArt }),
  setAsciiDensity: (asciiDensity) => set({ asciiDensity }),
  setAsciiSize: (asciiSize) => set({ asciiSize }),
  setUploadedImage: (uploadedImage) => set({ uploadedImage }),
  setArtworkAspectRatio: (artworkAspectRatio) => set({ artworkAspectRatio }),
  
  setPlacement: (placement) => set({ placement }),
  setSize: (size) => set({ size }),
  
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  
  reset: () => set(initialState),
}))
