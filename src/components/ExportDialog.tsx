import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useProjectStore } from '@store/projectStore';
import { useUIStore } from '@store/uiStore';
import { ZipExportService } from '@services/zip-export';
import { FileSystemUtils } from '@utils/file-system';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ open, onClose }) => {
  const { currentProject } = useProjectStore();
  const { showToast } = useUIStore();
  const [format, setFormat] = useState('mp3');
  const [includeWavMasters, setIncludeWavMasters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportService = new ZipExportService();

  const handleExport = async () => {
    if (!currentProject) return;

    setIsExporting(true);
    try {
      // Create mock audio files for demo
      const audioFiles = currentProject.announcements.map(a => ({
        announcementId: a.id,
        blob: new Blob(['mock audio data'], { type: 'audio/mp3' })
      }));

      const zip = await exportService.createProjectZip({
        project: currentProject,
        announcements: currentProject.announcements,
        audioFiles,
        includeWavMasters
      });

      const fileName = `${currentProject.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.zip`;
      FileSystemUtils.downloadFile(zip, fileName);
      showToast('Project exported successfully', 'success');
      onClose();
    } catch (error) {
      showToast(`Export failed: ${error}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Project</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Audio Format</InputLabel>
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              label="Audio Format"
            >
              <MenuItem value="mp3">MP3</MenuItem>
              <MenuItem value="wav">WAV</MenuItem>
              <MenuItem value="ogg">OGG</MenuItem>
              <MenuItem value="flac">FLAC</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control=<Checkbox checked={includeWavMasters} onChange={(e) => setIncludeWavMasters(e.target.checked)} />
            label="Include WAV Masters (larger file size)"
          />

          <Typography variant="body2" color="textSecondary">
            Export will create a ZIP file containing all announcements and project metadata.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleExport}
          variant="contained"
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;
