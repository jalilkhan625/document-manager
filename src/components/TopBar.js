import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  TextField,
  Box,
  Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SortIcon from '@mui/icons-material/Sort';
import UploadIcon from '@mui/icons-material/Upload';
import ViewModuleIcon from '@mui/icons-material/ViewModule'; // grid
import ViewListIcon from '@mui/icons-material/ViewList';     // list

export default function TopBar({
  onNewFolder,
  onNewFile,
  onSearch,
  isGridView,
  onToggleView
}) {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>

        {/* New Folder Button */}
        <Button onClick={onNewFolder}>+ New Folder</Button>

        {/* Upload Button */}
        <Tooltip title="Upload File">
          <IconButton onClick={onNewFile}>
            <UploadIcon />
          </IconButton>
        </Tooltip>

        {/* View Toggle */}
        <Tooltip title={isGridView ? "Switch to List View" : "Switch to Grid View"}>
          <IconButton onClick={onToggleView}>
            {isGridView ? <ViewListIcon /> : <ViewModuleIcon />}
          </IconButton>
        </Tooltip>

        {/* Sort Button (you can expand this later) */}
        <Tooltip title="Sort">
          <IconButton>
            <SortIcon />
          </IconButton>
        </Tooltip>

        {/* Refresh Button (expandable later) */}
        <Tooltip title="Refresh">
          <IconButton>
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        {/* Push Search to the end */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Search Field */}
        <TextField
          size="small"
          placeholder="Search Files"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </Toolbar>
    </AppBar>
  );
}
