import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider
} from '@mui/material';
import { Announcement } from '@types/index';
import { useProjectStore } from '@store/projectStore';
import { useUIStore } from '@store/uiStore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface AnnouncementListProps {
  projectId: string;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({ projectId }) => {
  const { currentProject, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useProjectStore();
  const { showToast } = useUIStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newText, setNewText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  if (!currentProject) {
    return <Typography>No project selected</Typography>;
  }

  const handleAddNew = () => {
    setEditingAnnouncement(null);
    setNewText('');
    setDialogOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setNewText(announcement.text);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!newText.trim()) {
      showToast('Announcement text cannot be empty', 'warning');
      return;
    }

    try {
      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement.id, { text: newText });
        showToast('Announcement updated', 'success');
      } else {
        const announcement: Announcement = {
          id: `announcement-${Date.now()}`,
          projectId,
          text: newText,
          voiceProfileId: currentProject.voiceProfileId,
          order: currentProject.announcements.length,
          createdAt: new Date(),
          updatedAt: new Date(),
          settings: {
            warmth: 100,
            speed: 100,
            volume: 100
          }
        };
        await addAnnouncement(announcement);
        showToast('Announcement added', 'success');
      }
      setDialogOpen(false);
      setNewText('');
      setEditingAnnouncement(null);
    } catch (error) {
      showToast(`Error: ${error}`, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      showToast('Announcement deleted', 'success');
    } catch (error) {
      showToast(`Error: ${error}`, 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Announcements</Typography>
        <Button variant="contained" onClick={handleAddNew}>
          Add Announcement
        </Button>
      </Box>

      <Stack spacing={2}>
        {currentProject.announcements.map((announcement, index) => (
          <Card key={announcement.id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {index + 1}. {announcement.text}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Created: {announcement.createdAt.toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <IconButton
                size="small"
                onClick={() => handleEdit(announcement)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(announcement.id)}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton size="small" startIcon={<PlayArrowIcon />}>
                Preview
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Stack>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAnnouncement ? 'Edit Announcement' : 'Add Announcement'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Announcement Text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Enter your announcement text here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingAnnouncement ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnnouncementList;
