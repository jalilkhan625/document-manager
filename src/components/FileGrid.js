import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function FileGrid({ files = [], onRename, onDelete, onExpand, isGridView = true }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleMenuOpen = (event, file) => {
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleAction = (action) => {
    if (!selectedFile) return;
    if (action === 'rename') onRename?.(selectedFile);
    else if (action === 'delete') onDelete?.(selectedFile);
    else if (action === 'expand') onExpand?.(selectedFile);
    handleMenuClose();
  };

  return (
    <Box p={2}>
      {isGridView ? (
        <Grid container spacing={2}>
          {files.map((file) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={file.id || file.name}>
              <Card variant="outlined">
                <CardContent
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InsertDriveFileIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" noWrap>
                      {file.name}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, file)}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <List>
          {files.map((file) => (
            <ListItem
              key={file.id || file.name}
              secondaryAction={
                <IconButton edge="end" onClick={(e) => handleMenuOpen(e, file)}>
                  <MoreVertIcon />
                </IconButton>
              }
              button
              onClick={() => onExpand?.(file)}
            >
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                primaryTypographyProps={{ noWrap: true }}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleAction('rename')}>Rename</MenuItem>
        <MenuItem onClick={() => handleAction('delete')}>Delete</MenuItem>
        <MenuItem onClick={() => handleAction('expand')}>Expand</MenuItem>
      </Menu>
    </Box>
  );
}
