import React, { useMemo } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function FolderDetailView({
  folder,
  files = [],
  onBack,
  onDeleteFile,
  onRenameFile,
}) {
  const columns = useMemo(() => [
    { field: 'name', headerName: 'File Name', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <>
          <IconButton onClick={() => onRenameFile(row)}><EditIcon /></IconButton>
          <IconButton onClick={() => onDeleteFile(row)}><DeleteIcon /></IconButton>
        </>
      ),
      sortable: false,
      width: 100
    }
  ], [onDeleteFile, onRenameFile]);

  const rows = files.map(file => ({
    id: file.id,
    name: file.name,
    ...file
  }));

  // ✅ Add this check to avoid crashing
  if (!folder) {
    return (
      <Box p={2}>
        <Typography variant="h6">No folder selected</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={onBack}><ArrowBackIcon /></IconButton>
        <Typography variant="h6" ml={1}>Folder: {folder.name}</Typography>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        autoHeight
        disableRowSelectionOnClick
      />
    </Box>
  );
}
