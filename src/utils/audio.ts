/**
 * Celestial Web Audio synthesizer for cosmic star chime sounds.
 * Generates ethereal sine/triangle harmonic notes on the pentatonic scale.
 */

class CelestialAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isUnlocked: boolean = false;

  // Celestial Pentatonic Scale frequencies (Hz) across two octaves
  private frequencies = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
    1046.50 // C6
  ];

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playStarChime(xNorm: number = 0.5, volume: number = 0.3) {
    try {
      this.initContext();
      if (!this.ctx) return;

      // Select frequency based on x position or slight random variation
      const index = Math.min(
        this.frequencies.length - 1,
        Math.max(0, Math.floor(xNorm * this.frequencies.length) + (Math.random() > 0.6 ? 1 : 0))
      );
      const freq = this.frequencies[index] || 523.25;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      // Soft sparkling overtone
      osc.type = Math.random() > 0.3 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      // Subtle pitch bend upwards like a shooting star
      osc.frequency.exponentialRampToValueAtTime(freq * 1.03, now + 0.15);

      // Volume envelope: soft attack, gentle exponential decay
      const peakVol = Math.max(0.01, Math.min(volume * 0.4, 0.6));
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(peakVol, now + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8 + Math.random() * 0.4);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);

      // Optional shimmer harmonic layer
      if (Math.random() > 0.5) {
        const overtoneOsc = this.ctx.createOscillator();
        const overtoneGain = this.ctx.createGain();
        overtoneOsc.type = 'sine';
        overtoneOsc.frequency.setValueAtTime(freq * 2, now);
        
        overtoneGain.gain.setValueAtTime(0.0001, now);
        overtoneGain.gain.linearRampToValueAtTime(peakVol * 0.25, now + 0.04);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

        overtoneOsc.connect(overtoneGain);
        overtoneGain.connect(this.ctx.destination);
        overtoneOsc.start(now);
        overtoneOsc.stop(now + 0.6);
      }
    } catch {
      // Audio context might be restricted before interaction; safely catch
    }
  }

  public playSupernovaSound(volume: number = 0.4) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(220, now + 1.2);

      const peak = Math.max(0.01, Math.min(volume * 0.5, 0.7));
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.6);
    } catch {
      // Safe catch
    }
  }
}

export const celestialAudio = new CelestialAudioSynthesizer();
