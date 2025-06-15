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
  onSelect,
  onRename,
  onDelete,
  onAddSubfolder,
  isGridView,
  path = [],
  onBack
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [search, setSearch] = useState('');

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

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderFolders = () =>
    filteredFolders.map(folder => {
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

      {/* Files title and search field */}
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Files
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ccc',
            borderRadius: 2,
            px: 1,
            py: 0.5,
            width: 250,
            backgroundColor: '#fff'
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            width="20"
            fill="#6e6e6e"
            style={{ marginRight: 8 }}
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="Search Files"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '14px',
              color: '#333',
              background: 'transparent'
            }}
          />
        </Box>
      </Box>

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
