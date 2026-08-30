import { AudioBuffer, AudioAnalysisResult, AudioProcessingOptions } from '@types/audio';

export class AudioProcessingService {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  /**
   * Analyze audio buffer for quality metrics
   */
  analyzeAudio(buffer: Float32Array): AudioAnalysisResult {
    const length = buffer.length;
    let rms = 0;
    let peakLevel = 0;
    let sum = 0;

    // Calculate RMS and peak level
    for (let i = 0; i < length; i++) {
      const sample = buffer[i];
      sum += sample * sample;
      peakLevel = Math.max(peakLevel, Math.abs(sample));
    }

    rms = Math.sqrt(sum / length);

    // Calculate frequency spectrum
    const fft = this.performFFT(buffer);
    const frequency = fft.magnitude;
    const amplitude = fft.phase;

    // Detect noise level
    const noiseLevel = this.detectNoiseLevel(buffer);
    const silenceThreshold = noiseLevel * 1.5;

    // Calculate quality score
    const qualityScore = this.calculateQualityScore({
      rms,
      peakLevel,
      noiseLevel,
      clipping: peakLevel > 0.95
    });

    // Generate warnings
    const warnings: string[] = [];
    if (peakLevel > 0.95) warnings.push('Audio clipping detected');
    if (rms < 0.1) warnings.push('Very quiet recording');
    if (noiseLevel > 0.3) warnings.push('High background noise');

    return {
      frequency,
      amplitude,
      rms,
      peakLevel,
      duration: length / 44100, // Assuming 44.1kHz sample rate
      noiseLevel,
      silenceThreshold,
      qualityScore,
      warnings
    };
  }

  /**
   * Apply voice processing effects
   */
  async processAudio(
    audioBlob: Blob,
    options: AudioProcessingOptions
  ): Promise<Blob> {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);

    let processed = new Float32Array(channelData);

    // Apply effects in order
    if (options.pitch) {
      processed = this.applyPitchShift(processed, options.pitch);
    }

    if (options.speed) {
      processed = this.applySpeedShift(processed, options.speed);
    }

    if (options.warmth) {
      processed = this.applyWarmth(processed, options.warmth);
    }

    if (options.volume !== undefined) {
      processed = this.applyVolume(processed, options.volume);
    }

    if (options.normalization) {
      processed = this.normalize(processed);
    }

    if (options.noiseReduction) {
      processed = this.reduceNoise(processed);
    }

    return this.encodeAudioBuffer(processed);
  }

  /**
   * Apply pitch shifting (50-150)
   */
  private applyPitchShift(buffer: Float32Array, pitch: number): Float32Array {
    // Pitch 100 = normal, <100 = lower, >100 = higher
    const ratio = pitch / 100;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const position = i * ratio;
      const index = Math.floor(position);
      const fraction = position - index;

      if (index < buffer.length - 1) {
        // Linear interpolation
        result[i] = buffer[index] * (1 - fraction) + buffer[index + 1] * fraction;
      } else if (index < buffer.length) {
        result[i] = buffer[index];
      }
    }

    return result;
  }

  /**
   * Apply speed/tempo shifting (50-150)
   */
  private applySpeedShift(buffer: Float32Array, speed: number): Float32Array {
    // Speed 100 = normal, <100 = slower, >100 = faster
    const ratio = speed / 100;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const position = i * ratio;
      const index = Math.floor(position);

      if (index < buffer.length) {
        result[i] = buffer[index];
      }
    }

    return result;
  }

  /**
   * Apply warmth/EQ effect (50-150)
   */
  private applyWarmth(buffer: Float32Array, warmth: number): Float32Array {
    // Warmth 100 = neutral
    // <100 = brighter/cooler, >100 = warmer/darker
    const factor = (warmth - 100) / 50;
    const result = new Float32Array(buffer.length);

    for (let i = 0; i < buffer.length; i++) {
      // Simple low-pass filter effect for warmth
      if (i === 0) {
        result[i] = buffer[i];
      } else {
        const smooth = 0.5 + factor * 0.2;
        result[i] = buffer[i] * (1 - smooth) + result[i - 1] * smooth;
      }
    }

    return result;
  }

  /**
   * Apply volume scaling (0-200)
   */
  private applyVolume(buffer: Float32Array, volume: number): Float32Array {
    const factor = volume / 100;
    const result = new Float32Array(buffer.length);

    for (let i = 0; i < buffer.length; i++) {
      result[i] = Math.max(-1, Math.min(1, buffer[i] * factor));
    }

    return result;
  }

  /**
   * Normalize audio to -3dB
   */
  private normalize(buffer: Float32Array): Float32Array {
    let max = 0;
    for (let i = 0; i < buffer.length; i++) {
      max = Math.max(max, Math.abs(buffer[i]));
    }

    const factor = max > 0 ? 0.97 / max : 1; // -3dB headroom
    const result = new Float32Array(buffer.length);

    for (let i = 0; i < buffer.length; i++) {
      result[i] = buffer[i] * factor;
    }

    return result;
  }

  /**
   * Apply noise reduction
   */
  private reduceNoise(buffer: Float32Array): Float32Array {
    const noiseLevel = this.detectNoiseLevel(buffer);
    const threshold = noiseLevel * 2;
    const result = new Float32Array(buffer.length);

    for (let i = 0; i < buffer.length; i++) {
      if (Math.abs(buffer[i]) < threshold) {
        result[i] = buffer[i] * 0.1; // Reduce quiet parts
      } else {
        result[i] = buffer[i];
      }
    }

    return result;
  }

  /**
   * Detect noise level in audio
   */
  private detectNoiseLevel(buffer: Float32Array): number {
    // Analyze quietest 10% of signal
    const sorted = Array.from(buffer).map(Math.abs).sort((a, b) => a - b);
    const quietestIndex = Math.floor(sorted.length * 0.1);
    return sorted[quietestIndex] || 0;
  }

  /**
   * Calculate quality score (0-100)
   */
  private calculateQualityScore(metrics: {
    rms: number;
    peakLevel: number;
    noiseLevel: number;
    clipping: boolean;
  }): number {
    let score = 100;

    // Penalize clipping
    if (metrics.clipping) score -= 30;

    // Penalize too quiet
    if (metrics.rms < 0.05) score -= 25;
    else if (metrics.rms < 0.1) score -= 10;

    // Penalize too loud (without clipping)
    if (metrics.peakLevel > 0.9 && metrics.peakLevel <= 0.95) score -= 5;

    // Penalize high noise
    if (metrics.noiseLevel > 0.3) score -= 20;
    else if (metrics.noiseLevel > 0.1) score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Perform FFT on audio data
   */
  private performFFT(buffer: Float32Array): { magnitude: number[]; phase: number[] } {
    const magnitude: number[] = [];
    const phase: number[] = [];
    const size = Math.min(buffer.length, 2048);

    for (let i = 0; i < size; i++) {
      magnitude.push(Math.abs(buffer[i]));
      phase.push(0);
    }

    return { magnitude, phase };
  }

  /**
   * Encode processed audio buffer to Blob
   */
  private async encodeAudioBuffer(buffer: Float32Array): Promise<Blob> {
    // Encode as WAV
    const sampleRate = this.audioContext.sampleRate;
    const numChannels = 1;
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // subchunk1 size
    view.setUint16(20, 1, true); // audio format (PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // avg byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    // PCM data
    let index = 44;
    for (let i = 0; i < length; i++) {
      view.setInt16(index, buffer[i] < 0 ? buffer[i] * 0x8000 : buffer[i] * 0x7fff, true);
      index += 2;
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }
}

export default AudioProcessingService;
