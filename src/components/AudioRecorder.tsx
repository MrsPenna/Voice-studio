import React, { useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  LinearProgress
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useAudioRecording } from '@hooks/useAudioRecording';
import { AudioFormatUtils } from '@utils/audio-format';

interface AudioRecorderProps {
  onRecordingComplete?: (blob: Blob) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop
}) => {
  const {
    isRecording,
    isPaused,
    recordingLevel,
    peakLevel,
    duration,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording
  } = useAudioRecording();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleStart = async () => {
    try {
      await startRecording();
      onRecordingStart?.();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStop = async () => {
    try {
      setIsProcessing(true);
      const blob = await stopRecording();
      onRecordingStop?.();
      onRecordingComplete?.(blob);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Audio Recorder</Typography>

          {isRecording && (
            <>
              <Box>
                <Typography variant="body2" gutterBottom>
                  Recording Level: {recordingLevel}%
                </Typography>
                <LinearProgress variant="determinate" value={recordingLevel} />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Peak Level: {peakLevel}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={peakLevel}
                  color={peakLevel > 90 ? 'error' : 'primary'}
                />
              </Box>

              <Typography variant="body2" color="textSecondary">
                Duration: {AudioFormatUtils.formatDuration(duration)}
              </Typography>
            </>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isRecording ? (
              <Button
                variant="contained"
                startIcon={<MicIcon />}
                onClick={handleStart}
                disabled={isProcessing}
                color="error"
              >
                Start Recording
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={isPaused ? resumeRecording : pauseRecording}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<StopIcon />}
                  onClick={handleStop}
                  disabled={isProcessing}
                  color="error"
                >
                  {isProcessing ? 'Processing...' : 'Stop'}
                </Button>
              </>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AudioRecorder;
