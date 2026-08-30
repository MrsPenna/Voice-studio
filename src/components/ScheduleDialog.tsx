import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { useScheduledStore } from '@store/scheduledStore';
import { useUIStore } from '@store/uiStore';
import { ScheduledAnnouncement } from '@types/index';

interface ScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  announcementId: string;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({ open, onClose, announcementId }) => {
  const { createScheduled } = useScheduledStore();
  const { showToast } = useUIStore();
  const [scheduledTime, setScheduledTime] = useState(new Date().toISOString().slice(0, 16));
  const [recurrance, setRecurrance] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [notificationMinutesBefore, setNotificationMinutesBefore] = useState(5);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleSchedule = async () => {
    setIsScheduling(true);
    try {
      const scheduled: ScheduledAnnouncement = {
        id: `scheduled-${Date.now()}`,
        announcementId,
        scheduledTime: new Date(scheduledTime),
        recurrance,
        notificationEnabled,
        notificationMinutesBefore,
        status: 'pending'
      };

      await createScheduled(scheduled);
      showToast('Announcement scheduled successfully', 'success');
      onClose();
    } catch (error) {
      showToast(`Failed to schedule: ${error}`, 'error');
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule Announcement</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <Alert severity="info">
            Scheduled announcements will be automatically triggered at the specified time.
          </Alert>

          <TextField
            type="datetime-local"
            label="Scheduled Date & Time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            select
            label="Recurrence"
            value={recurrance}
            onChange={(e) => setRecurrance(e.target.value as any)}
          >
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </TextField>

          <FormControlLabel
            control=<Checkbox checked={notificationEnabled} onChange={(e) => setNotificationEnabled(e.target.checked)} />
            label="Send notification before announcement"
          />

          {notificationEnabled && (
            <TextField
              type="number"
              label="Minutes before announcement"
              value={notificationMinutesBefore}
              onChange={(e) => setNotificationMinutesBefore(parseInt(e.target.value) || 0)}
              inputProps={{ min: 1, max: 1440 }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSchedule}
          variant="contained"
          disabled={isScheduling}
        >
          {isScheduling ? 'Scheduling...' : 'Schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleDialog;
