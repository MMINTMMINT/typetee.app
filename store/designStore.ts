import { create } from 'zustand'

export type ShirtColor = 'black' | 'white'
export type Placement = 'front' | 'back'
export type Font = 'commodore' | 'vt323' | 'pressStart'
export type DesignMode = 'text' | 'ascii'
export type TShirtSize = 'S' | 'M' | 'L' | 'XL' | '2XL'
export type TextAlign = 'left' | 'center' | 'right'
export type AsciiStyle = 'standard' | 'lineArt' | 'solid' | 'shaded' | 'oldschool' | 'newschool' | 'irc' | 'typewriter' | 'emoticon'
export type AsciiTextPosition = 'top' | 'middle' | 'bottom'
export type AsciiTextBackground = 'solid' | 'transparent'

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
  asciiStyle: AsciiStyle
  setAsciiStyle: (style: AsciiStyle) => void
  uploadedImage: string | null
  setUploadedImage: (image: string | null) => void
  artworkAspectRatio: number | null
  setArtworkAspectRatio: (ratio: number | null) => void
  
  // ASCII text overlay
  asciiTextOverlay: string
  setAsciiTextOverlay: (text: string) => void
  asciiTextPosition: AsciiTextPosition
  setAsciiTextPosition: (position: AsciiTextPosition) => void
  asciiTextBackground: AsciiTextBackground
  setAsciiTextBackground: (background: AsciiTextBackground) => void
  showAsciiTextOverlay: boolean
  setShowAsciiTextOverlay: (show: boolean) => void
  asciiTextFont: Font
  setAsciiTextFont: (font: Font) => void
  asciiTextSize: number
  setAsciiTextSize: (size: number) => void
  asciiTextAlign: TextAlign
  setAsciiTextAlign: (align: TextAlign) => void
  asciiTextFitToBox: boolean
  setAsciiTextFitToBox: (fit: boolean) => void
  
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
  asciiStyle: 'standard' as AsciiStyle,
  uploadedImage: null,
  placement: 'front' as Placement,
  size: 'M' as TShirtSize,
  soundEnabled: true,
  asciiSize: 5,
  artworkAspectRatio: null,
  asciiTextOverlay: '',
  asciiTextPosition: 'bottom' as AsciiTextPosition,
  asciiTextBackground: 'solid' as AsciiTextBackground,
  showAsciiTextOverlay: false,
  asciiTextFont: 'pressStart' as Font,
  asciiTextSize: 3,
  asciiTextAlign: 'center' as TextAlign,
  asciiTextFitToBox: false,
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
  setAsciiStyle: (asciiStyle) => set({ asciiStyle }),
  setUploadedImage: (uploadedImage) => set({ uploadedImage }),
  setArtworkAspectRatio: (artworkAspectRatio) => set({ artworkAspectRatio }),
  
  setAsciiTextOverlay: (asciiTextOverlay) => set({ asciiTextOverlay }),
  setAsciiTextPosition: (asciiTextPosition) => set({ asciiTextPosition }),
  setAsciiTextBackground: (asciiTextBackground) => set({ asciiTextBackground }),
  setShowAsciiTextOverlay: (showAsciiTextOverlay) => set({ showAsciiTextOverlay }),
  setAsciiTextFont: (asciiTextFont) => set({ asciiTextFont }),
  setAsciiTextSize: (asciiTextSize) => set({ asciiTextSize }),
  setAsciiTextAlign: (asciiTextAlign) => set({ asciiTextAlign }),
  setAsciiTextFitToBox: (asciiTextFitToBox) => set({ asciiTextFitToBox }),
  
  setPlacement: (placement) => set({ placement }),
  setSize: (size) => set({ size }),
  
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  
  reset: () => set(initialState),
}))
