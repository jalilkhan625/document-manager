import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

export default function FileViewerDialog({ file, onClose }) {
  if (!file) return null;

  const download = () => {
    const link = document.createElement('a');
    link.href = file.content;
    link.download = file.name;
    link.click();
  };

  return (
    <Dialog open={!!file} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {file.name}
        <Box sx={{ float: 'right' }}>
          <IconButton onClick={download}><DownloadIcon /></IconButton>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <iframe
          src={file.content}
          title={file.name}
          width="100%"
          height="500px"
          style={{ border: 'none' }}
        />
      </DialogContent>
    </Dialog>
  );
}
