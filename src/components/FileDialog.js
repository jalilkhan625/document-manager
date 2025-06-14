import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, InputLabel, MenuItem, FormControl, Select, Box
} from '@mui/material';

export default function FileDialog({
  open,
  onClose,
  onSave,
  initialName,
  folders = [],
  allowUpload = false
}) {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [folderId, setFolderId] = useState('');
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    setName(initialName || '');
    if (folders.length > 0) {
      setFolderId(folders[0].id);
    }
  }, [initialName, folders]);

  const handleSave = () => {
    if (allowUpload && file) {
      onSave({
        file,
        name: name.trim(),
        folderId: newFolderName ? null : folderId,
        newFolderName: newFolderName || null
      });
    } else if (!allowUpload) {
      onSave(name.trim());
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setName(selected.name);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{allowUpload ? 'Upload File' : initialName ? 'Rename File' : 'New File'}</DialogTitle>
      <DialogContent>
        {allowUpload && (
          <Box my={1}>
            <input type="file" onChange={handleFileChange} />
          </Box>
        )}

        <TextField
          margin="dense"
          fullWidth
          label="File Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {allowUpload && (
          <>
            <FormControl margin="dense" fullWidth>
              <InputLabel>Select Existing Folder</InputLabel>
              <Select
                value={folderId}
                label="Select Existing Folder"
                onChange={(e) => setFolderId(e.target.value)}
                disabled={!!newFolderName}
              >
                {folders.map(folder => (
                  <MenuItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              fullWidth
              label="Or Create New Folder"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!name.trim() || (allowUpload && !file)}
        >
          {allowUpload ? 'Upload' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
