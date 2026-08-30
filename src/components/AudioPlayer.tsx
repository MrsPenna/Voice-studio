import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Stack
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import { useAudioWaveform } from '@hooks/useAudioWaveform';
import { AudioFormatUtils } from '@utils/audio-format';

interface AudioPlayerProps {
  audioUrl?: string;
  audioBlob?: Blob;
  duration?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  audioBlob,
  duration,
  onPlay,
  onPause,
  onStop
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { isPlaying, currentTime, play, pause, stop, seek } = useAudioWaveform({
    container: containerRef.current || new HTMLDivElement()
  });

  useEffect(() => {
    if (audioUrl) {
      // Load from URL
    } else if (audioBlob) {
      // Load from Blob
    }
  }, [audioUrl, audioBlob]);

  const handlePlay = () => {
    play();
    onPlay?.();
  };

  const handlePause = () => {
    pause();
    onPause?.();
  };

  const handleStop = () => {
    stop();
    onStop?.();
  };

  const displayDuration = duration ? AudioFormatUtils.formatDuration(duration) : '0:00';
  const displayCurrent = AudioFormatUtils.formatDuration(currentTime);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <div ref={containerRef} style={{ minHeight: 100 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              onClick={isPlaying ? handlePause : handlePlay}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<StopIcon />}
              onClick={handleStop}
            >
              Stop
            </Button>
            <Typography variant="caption" sx={{ ml: 'auto' }}>
              {displayCurrent} / {displayDuration}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={(currentTime / (duration || 1)) * 100}
            onClick={(e) => {
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              seek(percent * (duration || 0));
            }}
            sx={{ cursor: 'pointer' }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
