import { AudioBuffer, AudioMetadata, RecordingConfig, RecordingMetadata } from '@types/audio';

export class AudioRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private recordedChunks: Blob[] = [];
  private startTime: number = 0;
  private recordingMetadata: RecordingMetadata | null = null;

  /**
   * Initialize recording with microphone stream
   */
  async initialize(config: RecordingConfig): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        }
      });

      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(stream);

      // Create analyser for monitoring
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      source.connect(this.analyser);

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: config.mimeType,
        audioBitsPerSecond: config.audioBitsPerSecond
      });

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
    } catch (error) {
      throw new Error(`Failed to initialize recording: ${error}`);
    }
  }

  /**
   * Start recording
   */
  start(): void {
    if (!this.mediaRecorder) throw new Error('Recording not initialized');
    this.recordedChunks = [];
    this.startTime = Date.now();
    this.mediaRecorder.start();
  }

  /**
   * Stop recording and return blob
   */
  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Recording not initialized'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: this.mediaRecorder!.mimeType });
        this.recordedChunks = [];
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Pause recording
   */
  pause(): void {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  /**
   * Resume recording
   */
  resume(): void {
    if (this.mediaRecorder?.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  /**
   * Get recording level (0-100)
   */
  getRecordingLevel(): number {
    if (!this.analyser) return 0;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    return Math.round((average / 255) * 100);
  }

  /**
   * Get peak level
   */
  getPeakLevel(): number {
    if (!this.analyser) return 0;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    const max = Math.max(...dataArray);
    return Math.round((max / 255) * 100);
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.mediaRecorder = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.recordedChunks = [];
  }
}

export default AudioRecordingService;
