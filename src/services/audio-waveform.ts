import WaveSurfer from 'wavesurfer.js';
import { WaveformOptions, WaveformEvent } from '@types/audio';

export class AudioWaveformService {
  private waveSurfer: WaveSurfer | null = null;
  private listeners: Map<string, Set<(event: WaveformEvent) => void>> = new Map();

  /**
   * Initialize WaveSurfer instance
   */
  init(options: WaveformOptions): WaveSurfer {
    this.waveSurfer = WaveSurfer.create({
      ...options,
      waveColor: options.waveColor || '#4f46e5',
      progressColor: options.progressColor || '#10b981',
      cursorColor: options.cursorColor || '#f59e0b',
      barWidth: options.barWidth || 2,
      height: options.height || 100,
      normalize: true,
      interact: true,
      hideScrollbar: true
    });

    this.setupListeners();
    return this.waveSurfer;
  }

  /**
   * Load audio from URL
   */
  async load(url: string): Promise<void> {
    if (!this.waveSurfer) throw new Error('WaveSurfer not initialized');
    this.waveSurfer.load(url);
  }

  /**
   * Load audio from Blob
   */
  async loadBlob(blob: Blob): Promise<void> {
    if (!this.waveSurfer) throw new Error('WaveSurfer not initialized');
    const url = URL.createObjectURL(blob);
    this.waveSurfer.load(url);
  }

  /**
   * Play audio
   */
  play(): void {
    if (!this.waveSurfer) throw new Error('WaveSurfer not initialized');
    this.waveSurfer.play();
  }

  /**
   * Pause audio
   */
  pause(): void {
    if (!this.waveSurfer) throw new Error('WaveSurfer not initialized');
    this.waveSurfer.pause();
  }

  /**
   * Stop audio
   */
  stop(): void {
    if (!this.waveSurfer) throw new Error('WaveSurfer not initialized');
    this.waveSurfer.stop();
  }

  /**
   * Seek to time
   */
  seek(time: number): void {
    if (!this.waveSurfer) throw new Error('WaveSurfer not initialized');
    this.waveSurfer.seekTo(time / this.waveSurfer.getDuration());
  }

  /**
   * Get current time
   */
  getCurrentTime(): number {
    if (!this.waveSurfer) throw new Error('WaveSurfer not initialized');
    return this.waveSurfer.getCurrentTime();
  }

  /**
   * Get duration
   */
  getDuration(): number {
    if (!this.waveSurfer) throw new Error('WaveSurfer not initialized');
    return this.waveSurfer.getDuration();
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    if (!this.waveSurfer) throw new Error('WaveSurfer not initialized');
    this.waveSurfer.setVolume(Math.max(0, Math.min(1, volume)));
  }

  /**
   * Get waveform data
   */
  getWaveformData(): number[] {
    if (!this.waveSurfer) throw new Error('WaveSurfer not initialized');
    return this.waveSurfer.getDecodedData().getChannelData(0);
  }

  /**
   * Setup internal listeners
   */
  private setupListeners(): void {
    if (!this.waveSurfer) return;

    this.waveSurfer.on('play', () => {
      this.emit('play', { type: 'play', currentTime: this.waveSurfer?.getCurrentTime() });
    });

    this.waveSurfer.on('pause', () => {
      this.emit('pause', { type: 'pause', currentTime: this.waveSurfer?.getCurrentTime() });
    });

    this.waveSurfer.on('stop', () => {
      this.emit('stop', { type: 'stop', currentTime: 0 });
    });

    this.waveSurfer.on('seek', () => {
      this.emit('seek', { type: 'seek', currentTime: this.waveSurfer?.getCurrentTime() });
    });

    this.waveSurfer.on('ready', () => {
      this.emit('load', {
        type: 'load',
        duration: this.waveSurfer?.getDuration()
      });
    });

    this.waveSurfer.on('error', (error) => {
      this.emit('error', { type: 'error', error });
    });
  }

  /**
   * Subscribe to events
   */
  on(event: string, listener: (event: WaveformEvent) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  /**
   * Unsubscribe from events
   */
  off(event: string, listener: (event: WaveformEvent) => void): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(listener);
    }
  }

  /**
   * Emit event
   */
  private emit(event: string, data: WaveformEvent): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(listener => listener(data));
    }
  }

  /**
   * Destroy instance
   */
  destroy(): void {
    if (this.waveSurfer) {
      this.waveSurfer.destroy();
      this.waveSurfer = null;
    }
    this.listeners.clear();
  }
}

export default AudioWaveformService;
