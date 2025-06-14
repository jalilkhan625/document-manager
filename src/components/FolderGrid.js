import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileGrid from './FileGrid';

export default function FolderGrid({
  folders = [],
  onSelect,
  onRename,
  onDelete,
  onExpand,
  isGridView,
  folderFilesMap,
  expandedFolderId,
  onFileRename,
  onFileDelete,
  onFileView
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleMenuOpen = (e, folder) => {
    setAnchorEl(e.currentTarget);
    setSelectedFolder(folder);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFolder(null);
  };

  const handleAction = (action) => {
    if (!selectedFolder) return;
    if (action === 'edit') onRename(selectedFolder);
    else if (action === 'delete') onDelete(selectedFolder);
    else if (action === 'expand') onExpand(selectedFolder);
    handleMenuClose();
  };

  return (
    <Box p={2}>
      {isGridView ? (
        <Grid container spacing={2}>
          {folders.map(folder => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={folder.id}>
              <Card variant="outlined">
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box onClick={() => onSelect(folder)} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1" noWrap>{folder.name}</Typography>
                  </Box>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, folder)}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </CardContent>
                {expandedFolderId === folder.id && folderFilesMap[folder.id] && (
                  <FileGrid
                    files={folderFilesMap[folder.id]}
                    isGridView
                    onRename={onFileRename}
                    onDelete={onFileDelete}
                    onExpand={onFileView}
                  />
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <List>
          {folders.map(folder => (
            <Box key={folder.id}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" onClick={(e) => handleMenuOpen(e, folder)}>
                    <MoreVertIcon />
                  </IconButton>
                }
                button
                onClick={() => onSelect(folder)}
              >
                <ListItemIcon><FolderIcon sx={{ color: 'primary.main' }} /></ListItemIcon>
                <ListItemText primary={folder.name} />
              </ListItem>
              {expandedFolderId === folder.id && folderFilesMap[folder.id] && (
                <FileGrid
                  files={folderFilesMap[folder.id]}
                  isGridView={false}
                  onRename={onFileRename}
                  onDelete={onFileDelete}
                  onExpand={onFileView}
                />
              )}
            </Box>
          ))}
        </List>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleAction('edit')}>Edit</MenuItem>
        <MenuItem onClick={() => handleAction('delete')}>Delete</MenuItem>
        <MenuItem onClick={() => handleAction('expand')}>Expand</MenuItem>
      </Menu>
    </Box>
  );
}
