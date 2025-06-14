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
  ListItemText,
  Button
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function FolderGrid({
  folders = [],
  onSelect,           // Called to enter subfolder or view files
  onRename,
  onDelete,
  onAddSubfolder,
  isGridView,
  path = [],          // breadcrumb
  onBack              // go back
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleMenuOpen = (e, folder) => {
    e.stopPropagation();
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
    else if (action === 'add-subfolder') onAddSubfolder(selectedFolder);
    handleMenuClose();
  };

  const renderFolders = () =>
    folders.map(folder => {
      const folderContent = (
        <Box
          onClick={() => onSelect(folder)}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="subtitle1" noWrap>{folder.name}</Typography>
        </Box>
      );

      const menuButton = (
        <IconButton size="small" onClick={(e) => handleMenuOpen(e, folder)}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      );

      return isGridView ? (
        <Grid item xs={12} sm={6} md={4} lg={3} key={folder.id}>
          <Card variant="outlined">
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {folderContent}
              {menuButton}
            </CardContent>
          </Card>
        </Grid>
      ) : (
        <ListItem
          key={folder.id}
          secondaryAction={menuButton}
          button
          onClick={() => onSelect(folder)}
        >
          <ListItemIcon><FolderIcon sx={{ color: 'primary.main' }} /></ListItemIcon>
          <ListItemText primary={folder.name} />
        </ListItem>
      );
    });

  return (
    <Box p={2}>
      {path.length > 0 && (
        <Box mb={2}>
          <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
            Back to {path.length > 1 ? path[path.length - 2]?.name : 'Root'}
          </Button>
        </Box>
      )}

      {isGridView ? (
        <Grid container spacing={2}>
          {renderFolders()}
        </Grid>
      ) : (
        <List>{renderFolders()}</List>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleAction('edit')}>Rename</MenuItem>
        <MenuItem onClick={() => handleAction('delete')}>Delete</MenuItem>
        <MenuItem onClick={() => handleAction('add-subfolder')}>Add Subfolder</MenuItem>
      </Menu>
    </Box>
  );
}
