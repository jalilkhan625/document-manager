import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import LockIcon from '@mui/icons-material/Lock';

export default function Sidebar({ folders, selected, onSelect }) {
  return (
    <Box sx={{ width: 240, bgcolor: '#f0f0f0', height: '100vh' }}>
      <List>
        <ListItemButton selected>
          <ListItemText primary="Files" />
        </ListItemButton>
        {folders.map(folder => (
          <ListItemButton key={folder.name} selected={selected === folder.name} onClick={() => onSelect(folder.name)}>
            <ListItemIcon>
              {folder.locked ? <LockIcon fontSize="small" /> : <FolderIcon />}
            </ListItemIcon>
            <ListItemText primary={folder.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
