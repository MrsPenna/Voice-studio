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
  Box,
  Typography,
  Stack,
  Alert
} from '@mui/material';
import { useProjectStore } from '@store/projectStore';
import { useUIStore } from '@store/uiStore';
import { SpreadsheetImportService } from '@services/spreadsheet-import';
import FileUploadIcon from '@mui/icons-material/FileUpload';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (announcements: string[]) => Promise<void>;
}

const ImportDialog: React.FC<ImportDialogProps> = ({ open, onClose, onImport }) => {
  const { showToast } = useUIStore();
  const [file, setFile] = useState<File | null>(null);
  const [skipFirstRow, setSkipFirstRow] = useState(true);
  const [columnIndex, setColumnIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);

  const importService = new SpreadsheetImportService();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      setFile(selectedFile);
      const rows = await importService.parseFile(selectedFile);
      const announcements = importService.extractAnnouncements(rows, {
        skipFirstRow,
        announcementColumnIndex: columnIndex
      });
      setPreview(announcements.slice(0, 5));
    } catch (error) {
      showToast(`Failed to parse file: ${error}`, 'error');
    }
  };

  const handleImport = async () => {
    if (!file) {
      showToast('Please select a file', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const rows = await importService.parseFile(file);
      const announcements = importService.extractAnnouncements(rows, {
        skipFirstRow,
        announcementColumnIndex: columnIndex
      });

      const validation = importService.validate(rows, {
        skipFirstRow,
        announcementColumnIndex: columnIndex
      });

      if (!validation.isValid) {
        showToast(`Validation errors: ${validation.errors.join(', ')}`, 'error');
        return;
      }

      await onImport(announcements);
      showToast(`${announcements.length} announcements imported successfully`, 'success');
      onClose();
    } catch (error) {
      showToast(`Import failed: ${error}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import Announcements from Spreadsheet</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<FileUploadIcon />}
            >
              Select File (CSV/Excel)
              <input
                hidden
                type="file"
                accept=".csv,.xlsx,.xls,.txt"
                onChange={handleFileSelect}
              />
            </Button>
            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {file.name}
              </Typography>
            )}
          </Box>

          <TextField
            type="number"
            label="Column Index (0-based)"
            value={columnIndex}
            onChange={(e) => setColumnIndex(parseInt(e.target.value) || 0)}
            inputProps={{ min: 0, max: 10 }}
          />

          <FormControlLabel
            control=<Checkbox checked={skipFirstRow} onChange={(e) => setSkipFirstRow(e.target.checked)} />
            label="Skip first row (header)"
          />

          {preview.length > 0 && (
            <Box>
              <Typography variant="subtitle2">Preview (first 5 rows):</Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid', borderColor: 'divider', p: 1 }}>
                {preview.map((text, i) => (
                  <Typography key={i} variant="body2" sx={{ py: 0.5 }}>
                    {i + 1}. {text}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!file || isLoading}
        >
          {isLoading ? 'Importing...' : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportDialog;
