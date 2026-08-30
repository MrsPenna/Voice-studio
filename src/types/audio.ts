// Audio Analysis Types
export interface AudioAnalysisResult {
  frequency: number[];
  amplitude: number[];
  rms: number; // Root Mean Square (loudness)
  peakLevel: number;
  duration: number;
  noiseLevel: number;
  silenceThreshold: number;
  qualityScore: number; // 0-100
  warnings: string[];
}

// Audio Processing Types
export interface AudioProcessingOptions {
  warmth?: number; // 50-150
  speed?: number; // 50-150
  pitch?: number; // 50-150
  volume?: number; // 0-200
  compression?: boolean;
  normalization?: boolean;
  noiseReduction?: boolean;
}

// Waveform Event Types
export interface WaveformEvent {
  type: 'play' | 'pause' | 'stop' | 'seek' | 'load' | 'error';
  currentTime?: number;
  duration?: number;
  error?: Error;
}

// Audio Recording Types
export interface RecordingConfig {
  mimeType: string;
  audioBitsPerSecond: number;
  sampleRate: number;
}

export interface RecordingMetadata {
  startTime: number;
  endTime: number;
  duration: number;
  recordingLevel: number;
  peakLevel: number;
  averageLevel: number;
}
