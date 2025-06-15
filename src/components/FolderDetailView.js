import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

export default function FolderDetailView({
  folder,
  files = [],
  onBack,
  onDeleteFile,
  onRenameFile
}) {
  const [search, setSearch] = useState('');

  const handleViewFile = (file) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      const ext = file.name.split('.').pop().toLowerCase();
      const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(ext);
      const isPdf = ext === 'pdf';

      const content = `
        <html>
        <head>
          <title>${file.name}</title>
          <style>
            body { margin: 0; font-family: sans-serif; background: #f0f0f0; display: flex; flex-direction: column; align-items: center; }
            .toolbar {
              width: 100%; background: #333; color: #fff;
              display: flex; justify-content: space-between; align-items: center;
              padding: 10px 20px;
            }
            .toolbar button {
              background: none; border: none; color: white; font-size: 16px; cursor: pointer;
            }
            iframe, img {
              max-width: 100%;
              height: 90vh;
              border: none;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <span>${file.name}</span>
            <div>
              <button onclick="window.location.href='${file.content}'" download>📥 Download</button>
              <button onclick="window.close()">❌ Close</button>
            </div>
          </div>
          ${
            isImage
              ? `<img src="${file.content}" alt="${file.name}" />`
              : isPdf
                ? `<iframe src="${file.content}"></iframe>`
                : `<p style="padding: 20px;">Unsupported file type. Only images and PDFs can be previewed.</p>`
          }
        </body>
        </html>
      `;
      newWindow.document.write(content);
      newWindow.document.close();
    }
  };

  const columns = useMemo(() => [
    { field: 'name', headerName: 'File Name', flex: 1, sortable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <>
          <IconButton onClick={() => handleViewFile(row)}><VisibilityIcon /></IconButton>
          <IconButton onClick={() => onRenameFile(row)}><EditIcon /></IconButton>
          <IconButton onClick={() => onDeleteFile(row)}><DeleteIcon /></IconButton>
        </>
      ),
      sortable: false,
      width: 130
    }
  ], [onDeleteFile, onRenameFile]);

  const filteredRows = useMemo(() => {
    return files
      .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
      .map(file => ({
        id: file.id,
        name: file.name,
        ...file
      }));
  }, [files, search]);

  if (!folder) {
    return (
      <Box p={2}>
        <Typography variant="h6">No folder selected</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      {/* Back and title */}
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={onBack}><ArrowBackIcon /></IconButton>
        <Typography variant="h6" ml={1}>Folder: {folder.name}</Typography>
      </Box>

      {/* Search bar */}
      <Box mb={2} display="flex" justifyContent="flex-end">
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search files"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* File list table */}
      <DataGrid
        rows={filteredRows}
        columns={columns}
        checkboxSelection
        autoHeight
        disableRowSelectionOnClick
      />
    </Box>
  );
}
