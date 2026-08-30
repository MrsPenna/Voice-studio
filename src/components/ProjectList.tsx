import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Project } from '@types/index';
import { useProjectStore } from '@store/projectStore';
import { useUIStore } from '@store/uiStore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export const ProjectList: React.FC = () => {
  const { projects, loadProjects, deleteProject, setCurrentProject } = useProjectStore();
  const { showToast, setShowCreateProjectDialog } = useUIStore();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      showToast('Project deleted successfully', 'success');
    } catch (error) {
      showToast(`Failed to delete project: ${error}`, 'error');
    }
  };

  const handleSelect = (project: Project) => {
    setCurrentProject(project);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateProjectDialog(true)}
        >
          New Project
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
        {projects.map(project => (
          <Card key={project.id} sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {project.name}
              </Typography>
              {project.description && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>
              )}
              <Typography variant="caption" color="textSecondary">
                {project.announcements.length} announcements
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleSelect(project)}
                >
                  Open
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ProjectList;
