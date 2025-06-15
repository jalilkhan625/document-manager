import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Tooltip,
  Typography,
  Menu,
  MenuItem
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SortIcon from '@mui/icons-material/Sort';
import UploadIcon from '@mui/icons-material/Upload';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';

export default function TopBar({
  onNewFolder,
  onNewFile,
  isGridView,
  onToggleView,
  onSortChange,
  onRefresh
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortOption = (option) => {
    setAnchorEl(null);
    if (onSortChange) {
      onSortChange(option);
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>

        {/* Left section: Logo + Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionIcon sx={{ fontSize: 32, color: '#1a2b4c' }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#1a2b4c' }}>
              Documento
            </Typography>
          </Box>

          <Button startIcon={<AddIcon />} onClick={onNewFolder}>
            New folder
          </Button>

          <Button startIcon={<UploadIcon />} onClick={onNewFile}>
            Upload
          </Button>

          {/* Sort button with dropdown menu */}
          <Button startIcon={<SortIcon />} onClick={handleSortClick}>
            Sort by
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => handleSortOption('name-asc')}>Name (A-Z)</MenuItem>
            <MenuItem onClick={() => handleSortOption('name-desc')}>Name (Z-A)</MenuItem>
            <MenuItem onClick={() => handleSortOption('date-asc')}>Date (Oldest)</MenuItem>
            <MenuItem onClick={() => handleSortOption('date-desc')}>Date (Newest)</MenuItem>
          </Menu>

          {/* Refresh button */}
          <Button startIcon={<RefreshIcon />} onClick={onRefresh}>
            Refresh
          </Button>
        </Box>

        {/* View toggle */}
        <Tooltip title={isGridView ? 'Switch to List View' : 'Switch to Grid View'}>
          <Button
            startIcon={isGridView ? <ViewListIcon /> : <ViewModuleIcon />}
            onClick={onToggleView}
          >
            {isGridView ? 'List view' : 'Grid view'}
          </Button>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
