import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import FolderGrid from './components/FolderGrid';
import FileViewerDialog from './components/FileViewerDialog';
import FolderDialog from './components/FolderDialog';
import FileDialog from './components/FileDialog';
import {
  createFolder,
  createFile,
  fetchFolders,
  fetchFiles,
  renameFolder,
  deleteFolder,
  renameFile,
  deleteFile,
} from './utils/db';

function App() {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [expandedFolderId, setExpandedFolderId] = useState(null);
  const [folderFilesMap, setFolderFilesMap] = useState({});
  const [isFolderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [fileToEdit, setFileToEdit] = useState(null);
  const [isFileDialogOpen, setFileDialogOpen] = useState(false);
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [viewedFile, setViewedFile] = useState(null);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    const folderData = await fetchFolders();
    const folderList = Object.entries(folderData || {}).map(([id, data]) => ({ id, ...data }));
    setFolders(folderList);
    if (!selectedFolderId && folderList.length > 0) {
      setSelectedFolderId(folderList[0].id);
    }
  };

  const handleExpandFolder = async (folder) => {
    const fileData = await fetchFiles();
    const fileList = Object.entries(fileData || {}).map(([id, data]) => ({ id, ...data }));
    const filtered = fileList.filter(f => f.folderId === folder.id);
    setExpandedFolderId(folder.id);
    setFolderFilesMap(prev => ({ ...prev, [folder.id]: filtered }));
  };

  const handleNewFolder = () => {
    setFolderToEdit(null);
    setFolderDialogOpen(true);
  };

  const handleRenameFolder = (folder) => {
    setFolderToEdit(folder);
    setFolderDialogOpen(true);
  };

  const handleDeleteFolder = async (folder) => {
    await deleteFolder(folder.id);
    setFolders(prev => prev.filter(f => f.id !== folder.id));
    if (selectedFolderId === folder.id) setSelectedFolderId(null);
  };

  const handleSaveFolder = async (name) => {
    if (folderToEdit) {
      await renameFolder(folderToEdit.id, name);
    } else {
      await createFolder(name);
    }
    setFolderDialogOpen(false);
    loadFolders();
  };

  const handleNewFile = () => setUploadDialogOpen(true);

  const handleRenameFile = (file) => {
    setFileToEdit(file);
    setFileDialogOpen(true);
  };

  const handleDeleteFile = async (file) => {
    await deleteFile(file.id);
    setFolderFilesMap(prev => ({
      ...prev,
      [file.folderId]: prev[file.folderId]?.filter(f => f.id !== file.id)
    }));
  };

  const handleSaveFile = async (name) => {
    if (fileToEdit) {
      await renameFile(fileToEdit.id, name);
    }
    setFileDialogOpen(false);
    if (fileToEdit?.folderId) handleExpandFolder({ id: fileToEdit.folderId });
  };

  const handleUploadFile = async ({ file, name, folderId, newFolderName }) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const content = reader.result;
      let targetFolderId = folderId;

      if (newFolderName) {
        targetFolderId = await createFolder(newFolderName);
        loadFolders();
      }

      await createFile(name, targetFolderId || null, content);
      setUploadDialogOpen(false);
      if (targetFolderId) handleExpandFolder({ id: targetFolderId });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box display="flex">
      <Sidebar folders={folders} selected={null} onSelect={() => {}} />
      <Box flex={1}>
        <TopBar
          onNewFolder={handleNewFolder}
          onNewFile={handleNewFile}
          isGridView={isGridView}
          onToggleView={() => setIsGridView(prev => !prev)}
        />

        <FolderGrid
          folders={folders}
          onSelect={handleExpandFolder}
          onRename={handleRenameFolder}
          onDelete={handleDeleteFolder}
          onExpand={handleExpandFolder}
          isGridView={isGridView}
          folderFilesMap={folderFilesMap}
          expandedFolderId={expandedFolderId}
          onFileRename={handleRenameFile}
          onFileDelete={handleDeleteFile}
          onFileView={(file) => setViewedFile(file)}
        />
      </Box>

      <FolderDialog
        open={isFolderDialogOpen}
        onClose={() => setFolderDialogOpen(false)}
        onSave={handleSaveFolder}
        initialName={folderToEdit?.name}
      />
      <FileDialog
        open={isFileDialogOpen}
        onClose={() => setFileDialogOpen(false)}
        onSave={handleSaveFile}
        initialName={fileToEdit?.name}
      />
      <FileDialog
        open={isUploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onSave={handleUploadFile}
        folders={folders}
        allowUpload
      />
      <FileViewerDialog file={viewedFile} onClose={() => setViewedFile(null)} />
    </Box>
  );
}

export default App;
