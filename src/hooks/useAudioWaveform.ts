import { useEffect, useRef, useCallback, useState } from 'react';
import { AudioWaveformService } from '@services/audio-waveform';
import { WaveformOptions, WaveformEvent } from '@types/audio';

export interface UseAudioWaveformReturn {
  isLoaded: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  on: (event: string, listener: (event: WaveformEvent) => void) => void;
  off: (event: string, listener: (event: WaveformEvent) => void) => void;
}

export const useAudioWaveform = (options: WaveformOptions): UseAudioWaveformReturn => {
  const serviceRef = useRef<AudioWaveformService | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const service = new AudioWaveformService();
    serviceRef.current = service;

    try {
      service.init(options);

      // Setup listeners
      service.on('load', (event) => {
        setIsLoaded(true);
        setDuration(event.duration || 0);
      });

      service.on('play', () => {
        setIsPlaying(true);
        updateTime();
      });

      service.on('pause', () => {
        setIsPlaying(false);
      });

      service.on('stop', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    } catch (error) {
      console.error('Failed to initialize waveform:', error);
    }

    return () => {
      service.destroy();
    };
  }, [options]);

  const updateTime = useCallback(() => {
    if (serviceRef.current && isPlaying) {
      const time = serviceRef.current.getCurrentTime();
      setCurrentTime(time);
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  }, [isPlaying]);

  const play = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stop();
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (serviceRef.current) {
      serviceRef.current.seek(time);
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (serviceRef.current) {
      serviceRef.current.setVolume(volume);
    }
  }, []);

  const on = useCallback((event: string, listener: (event: WaveformEvent) => void) => {
    if (serviceRef.current) {
      serviceRef.current.on(event, listener);
    }
  }, []);

  const off = useCallback((event: string, listener: (event: WaveformEvent) => void) => {
    if (serviceRef.current) {
      serviceRef.current.off(event, listener);
    }
  }, []);

  return {
    isLoaded,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    stop,
    seek,
    setVolume,
    on,
    off
  };
};

export default useAudioWaveform;
