import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { NavItem } from '@types/ui';

interface SidebarProps {
  items: NavItem[];
  onNavigate: (path: string) => void;
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, onNavigate, currentPath }) => {
  const [open, setOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleToggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleNavigate = (path: string) => {
    onNavigate(path);
  };

  const renderNavItems = (items: NavItem[], level = 0) => {
    return (
      <>
        {items.map(item => (
          <React.Fragment key={item.id}>
            <ListItem
              disablePadding
              sx={{
                pl: level > 0 ? level * 2 : 0
              }}
            >
              <ListItemButton
                selected={currentPath === item.path}
                onClick={() => {
                  if (item.children) {
                    handleToggleExpand(item.id);
                  } else {
                    handleNavigate(item.path);
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {item.badge && <Badge badgeContent={item.badge} color="primary" />}
                {item.children && (expandedItems.has(item.id) ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            {item.children && (
              <Collapse
                in={expandedItems.has(item.id)}
                timeout="auto"
                unmountOnExit
              >
                {renderNavItems(item.children, level + 1)}
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Classroom Voice Studio
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Box sx={{ width: open ? 280 : 80, transition: 'width 0.3s' }}>
          <List>
            {renderNavItems(items)}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
