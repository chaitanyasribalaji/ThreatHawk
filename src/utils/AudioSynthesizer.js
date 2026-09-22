// Web Audio API Synthesizer for Emergency Sirens, Fake Call Ringtone, and Beeps

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sirenOsc = null;
    this.sirenGain = null;
    this.sirenLfo = null;
    this.isSirenPlaying = false;
    this.ringtoneInterval = null;
    this.isRingtonePlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBeep(freq = 880, duration = 0.15, type = 'sine') {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play failed", e);
    }
  }

  startSiren() {
    try {
      this.init();
      if (!this.ctx || this.isSirenPlaying) return;

      this.isSirenPlaying = true;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const lfo = this.ctx.createOscillator();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, this.ctx.currentTime);

      // Siren sweep modulation
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(2.5, this.ctx.currentTime); // 2.5 Hz siren sweep

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(300, this.ctx.currentTime); // sweep between 400Hz and 1000Hz

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      lfo.start();
      osc.start();

      this.sirenOsc = osc;
      this.sirenGain = gain;
      this.sirenLfo = lfo;
    } catch (e) {
      console.warn("Siren start error", e);
    }
  }

  stopSiren() {
    if (this.isSirenPlaying) {
      try {
        if (this.sirenGain && this.ctx) {
          this.sirenGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        }
        setTimeout(() => {
          if (this.sirenOsc) {
            this.sirenOsc.stop();
            this.sirenOsc.disconnect();
          }
          if (this.sirenLfo) {
            this.sirenLfo.stop();
            this.sirenLfo.disconnect();
          }
          this.isSirenPlaying = false;
        }, 150);
      } catch (e) {
        this.isSirenPlaying = false;
      }
    }
  }

  startRingtone() {
    if (this.isRingtonePlaying) return;
    this.isRingtonePlaying = true;

    const playRingCycle = () => {
      if (!this.isRingtonePlaying) return;
      this.playBeep(440, 0.4, 'sine');
      setTimeout(() => {
        if (this.isRingtonePlaying) this.playBeep(480, 0.8, 'sine');
      }, 450);
    };

    playRingCycle();
    this.ringtoneInterval = setInterval(playRingCycle, 3000);
  }

  stopRingtone() {
    this.isRingtonePlaying = false;
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }
}

export const soundEngine = new SoundEngine();
