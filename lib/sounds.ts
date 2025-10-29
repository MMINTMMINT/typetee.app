// Retro game sound effects using Web Audio API
// No external files needed - all sounds generated programmatically!

class RetroSounds {
  private audioContext: AudioContext | null = null

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  // Simple button click/beep
  click() {
    const ctx = this.getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'square'
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }

  // Mode selection (text/ASCII)
  modeSelect() {
    const ctx = this.getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(600, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.15)
  }

  // Theme toggle
  themeToggle() {
    const ctx = this.getAudioContext()
    
    // Two-tone beep
    for (let i = 0; i < 2; i++) {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.value = i === 0 ? 700 : 900
      oscillator.type = 'square'
      
      const startTime = ctx.currentTime + (i * 0.08)
      gainNode.gain.setValueAtTime(0.25, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + 0.08)
    }
  }

  // Size selection
  sizeSelect() {
    const ctx = this.getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.value = 1000
    oscillator.type = 'triangle'
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.12)
  }

  // Buy now button (special)
  buyNow() {
    const ctx = this.getAudioContext()
    
    // Rising three-tone success sound
    const frequencies = [600, 800, 1000]
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.value = freq
      oscillator.type = 'sine'
      
      const startTime = ctx.currentTime + (i * 0.1)
      gainNode.gain.setValueAtTime(0.2, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + 0.15)
    })
  }

  // Checkout/proceed to payment
  checkout() {
    const ctx = this.getAudioContext()
    
    // Power-up sound
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(400, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3)
    oscillator.type = 'sawtooth'
    
    gainNode.gain.setValueAtTime(0.25, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  }

  // Success/order complete
  success() {
    const ctx = this.getAudioContext()
    
    // Victory jingle
    const melody = [
      { freq: 523, time: 0 },      // C
      { freq: 659, time: 0.15 },   // E
      { freq: 784, time: 0.3 },    // G
      { freq: 1047, time: 0.45 },  // C (high)
    ]
    
    melody.forEach(note => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.value = note.freq
      oscillator.type = 'square'
      
      const startTime = ctx.currentTime + note.time
      gainNode.gain.setValueAtTime(0.2, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + 0.15)
    })
  }

  // Upload complete
  uploadComplete() {
    const ctx = this.getAudioContext()
    
    // Quick ascending chirp
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.2)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.2)
  }

  // Error/cancel
  error() {
    const ctx = this.getAudioContext()
    
    // Low descending tone
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(400, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3)
    oscillator.type = 'sawtooth'
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  }
}

// Singleton instance
const sounds = new RetroSounds()

export default sounds
