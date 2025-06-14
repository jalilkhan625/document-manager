import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import FolderGrid from './components/FolderGrid';
import FolderDetailView from './components/FolderDetailView';
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
  deleteFile
} from './utils/db';

function App() {
  const [allFolders, setAllFolders] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [folderStack, setFolderStack] = useState([]); // breadcrumb
  const [subfolders, setSubfolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [viewedFile, setViewedFile] = useState(null);
  const [fileToEdit, setFileToEdit] = useState(null);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [folderParent, setFolderParent] = useState(null);
  const [isFileDialogOpen, setFileDialogOpen] = useState(false);
  const [isFolderDialogOpen, setFolderDialogOpen] = useState(false);
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isGridView, setIsGridView] = useState(true);

  const currentFolder = folderStack[folderStack.length - 1] || null;

  const loadData = async () => {
    const foldersSnap = await fetchFolders();
    const filesSnap = await fetchFiles();
    const folders = Object.entries(foldersSnap || {}).map(([id, f]) => ({ id, ...f }));
    const files = Object.entries(filesSnap || {}).map(([id, f]) => ({ id, ...f }));
    setAllFolders(folders);
    setAllFiles(files);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!currentFolder) {
      setSubfolders(allFolders.filter(f => !f.parentId));
      setFiles([]);
    } else {
      const children = allFolders.filter(f => f.parentId === currentFolder.id);
      setSubfolders(children);

      if (children.length === 0) {
        const folderFiles = allFiles.filter(f => f.folderId === currentFolder.id);
        setFiles(folderFiles);
      } else {
        setFiles([]);
      }
    }
  }, [currentFolder, allFolders, allFiles]);

  const refreshAndStay = () => {
    loadData().then(() => {
      if (currentFolder) setFolderStack([...folderStack]);
    });
  };

  const handleNewFolder = () => {
    setFolderToEdit(null);
    setFolderParent(null);
    setFolderDialogOpen(true);
  };

  const handleAddSubfolder = (folder) => {
    setFolderToEdit(null);
    setFolderParent(folder);
    setFolderDialogOpen(true);
  };

  const handleRenameFolder = (folder) => {
    setFolderToEdit(folder);
    setFolderDialogOpen(true);
  };

  const handleDeleteFolder = async (folder) => {
    await deleteFolder(folder.id);
    refreshAndStay();
  };

  const handleSaveFolder = async (name) => {
    try {
      if (folderToEdit) {
        await renameFolder(folderToEdit.id, name);
      } else {
        const parentId = folderParent?.id || currentFolder?.id || null;
        await createFolder(name, parentId);
      }
      setFolderDialogOpen(false);
      setFolderToEdit(null);
      setFolderParent(null);
      refreshAndStay();
    } catch (err) {
      console.error('Save Folder Error:', err);
    }
  };

  const handleUploadFile = async ({ file, name, folderId, newFolderName }) => {
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const content = reader.result;
        let targetFolderId = folderId || currentFolder?.id;

        if (newFolderName) {
          targetFolderId = await createFolder(newFolderName, currentFolder?.id);
        }

        await createFile(name, targetFolderId, content);
        setUploadDialogOpen(false);
        refreshAndStay();
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload File Error:', err);
    }
  };

  const handleRenameFile = (file) => {
    setFileToEdit(file);
    setFileDialogOpen(true);
  };

  const handleDeleteFile = async (file) => {
    await deleteFile(file.id);
    setFiles(prev => prev.filter(f => f.id !== file.id));
  };

  const handleSaveFile = async (newName) => {
    if (fileToEdit) {
      await renameFile(fileToEdit.id, newName);
      setFiles(prev => prev.map(f => f.id === fileToEdit.id ? { ...f, name: newName } : f));
      setFileDialogOpen(false);
    }
  };

  const handleFolderClick = (folder) => {
    setFolderStack(prev => [...prev, folder]);
  };

  const handleBack = () => {
    setFolderStack(prev => prev.slice(0, -1));
  };

  return (
    <Box display="flex">
      <Sidebar onSelect={(folder) => setFolderStack([folder])} />
      <Box flex={1}>
        <TopBar
          onNewFolder={handleNewFolder}
          onNewFile={() => setUploadDialogOpen(true)}
          isGridView={isGridView}
          onToggleView={() => setIsGridView(prev => !prev)}
        />
        {currentFolder && subfolders.length === 0 ? (
          <FolderDetailView
            folder={currentFolder}
            files={files}
            onBack={handleBack}
            onDeleteFile={handleDeleteFile}
            onRenameFile={handleRenameFile}
            onViewFile={setViewedFile}
          />
        ) : (
          <FolderGrid
            folders={subfolders}
            onSelect={handleFolderClick}
            onRename={handleRenameFolder}
            onDelete={handleDeleteFolder}
            onAddSubfolder={handleAddSubfolder}
            isGridView={isGridView}
          />
        )}
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
        allowUpload
      />
      <FileViewerDialog file={viewedFile} onClose={() => setViewedFile(null)} />
    </Box>
  );
}

export default App;
