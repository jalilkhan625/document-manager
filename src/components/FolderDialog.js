import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export default function FolderDialog({ open, onClose, onSave, initialName }) {
  const [name, setName] = useState('');

  useEffect(() => {
    setName(initialName || '');
  }, [initialName]);

  const handleSave = () => {
    if (name.trim()) onSave(name.trim());
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialName ? 'Rename Folder' : 'New Folder'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          autoFocus
          label="Folder Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!name.trim()}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
