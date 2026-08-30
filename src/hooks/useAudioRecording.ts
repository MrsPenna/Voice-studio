import { useEffect, useRef, useCallback } from 'react';
import { AudioRecordingService } from '@services/audio-recording';
import { RecordingConfig, RecordingMetadata } from '@types/audio';

export interface UseAudioRecordingReturn {
  isRecording: boolean;
  isPaused: boolean;
  recordingLevel: number;
  peakLevel: number;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  cleanup: () => void;
}

export const useAudioRecording = (config?: Partial<RecordingConfig>): UseAudioRecordingReturn => {
  const serviceRef = useRef<AudioRecordingService | null>(null);
  const isRecordingRef = useRef(false);
  const isPausedRef = useRef(false);
  const recordingLevelRef = useRef(0);
  const peakLevelRef = useRef(0);
  const durationRef = useRef(0);
  const startTimeRef = useRef(0);
  const animationFrameRef = useRef<number>();

  const defaultConfig: RecordingConfig = {
    mimeType: 'audio/webm',
    audioBitsPerSecond: 128000,
    sampleRate: 44100,
    ...config
  };

  useEffect(() => {
    const service = new AudioRecordingService();
    serviceRef.current = service;

    return () => {
      service.cleanup();
    };
  }, []);

  const updateMetrics = useCallback(() => {
    if (!serviceRef.current) return;

    recordingLevelRef.current = serviceRef.current.getRecordingLevel();
    peakLevelRef.current = serviceRef.current.getPeakLevel();

    if (startTimeRef.current > 0) {
      durationRef.current = (Date.now() - startTimeRef.current) / 1000;
    }

    if (isRecordingRef.current && !isPausedRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateMetrics);
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!serviceRef.current) throw new Error('Recording service not initialized');

    try {
      await serviceRef.current.initialize(defaultConfig);
      serviceRef.current.start();
      isRecordingRef.current = true;
      isPausedRef.current = false;
      startTimeRef.current = Date.now();
      updateMetrics();
    } catch (error) {
      throw new Error(`Failed to start recording: ${error}`);
    }
  }, [defaultConfig, updateMetrics]);

  const stopRecording = useCallback(async (): Promise<Blob> => {
    if (!serviceRef.current) throw new Error('Recording service not initialized');

    try {
      const blob = await serviceRef.current.stop();
      isRecordingRef.current = false;
      isPausedRef.current = false;
      startTimeRef.current = 0;
      durationRef.current = 0;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      return blob;
    } catch (error) {
      throw new Error(`Failed to stop recording: ${error}`);
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (!serviceRef.current) return;
    serviceRef.current.pause();
    isPausedRef.current = true;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (!serviceRef.current) return;
    serviceRef.current.resume();
    isPausedRef.current = false;
    updateMetrics();
  }, [updateMetrics]);

  const cleanup = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.cleanup();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  return {
    isRecording: isRecordingRef.current,
    isPaused: isPausedRef.current,
    recordingLevel: recordingLevelRef.current,
    peakLevel: peakLevelRef.current,
    duration: durationRef.current,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cleanup
  };
};

export default useAudioRecording;
