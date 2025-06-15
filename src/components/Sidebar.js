import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LockIcon from '@mui/icons-material/Lock';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CollapseAllIcon from '@mui/icons-material/ChevronLeft';

import { listenToFolders, fetchFiles } from '../utils/db';

export default function Sidebar({ selected, onSelect }) {
  const [folders, setFolders] = useState([]);
  const [openMap, setOpenMap] = useState({});
  const [isAllExpanded, setIsAllExpanded] = useState(true);
  const [folderFilesMap, setFolderFilesMap] = useState({});

  const getAllFolderIds = (folderList) => {
    const ids = [];
    folderList.forEach(folder => {
      if (folder.id) {
        ids.push(folder.id);
        if (folder.children?.length > 0) {
          ids.push(...getAllFolderIds(folder.children));
        }
      }
    });
    return ids;
  };

  const buildFolderTree = (flatFolders) => {
    const map = {};
    const roots = [];

    flatFolders.forEach(folder => {
      map[folder.id] = { ...folder, children: [] };
    });

    flatFolders.forEach(folder => {
      const parent = map[folder.parentId];
      if (folder.parentId && parent) {
        parent.children.push(map[folder.id]);
      } else if (!folder.parentId) {
        roots.push(map[folder.id]);
      }
    });

    return roots.sort((a, b) => a.name.localeCompare(b.name));
  };

  useEffect(() => {
    const unsubscribe = listenToFolders(async (data) => {
      const flatFolders = Object.entries(data || {}).map(([id, folder]) => ({ id, ...folder }));
      const tree = buildFolderTree(flatFolders);
      setFolders(tree);

      const allIds = getAllFolderIds(tree);
      setOpenMap(allIds.reduce((acc, id) => ({ ...acc, [id]: true }), {}));
      setIsAllExpanded(true);

      const allFiles = await fetchFiles();
      const fileList = Object.entries(allFiles || {}).map(([id, data]) => ({ id, ...data }));
      const grouped = fileList.reduce((acc, file) => {
        if (!acc[file.folderId]) acc[file.folderId] = [];
        acc[file.folderId].push(file);
        return acc;
      }, {});
      setFolderFilesMap(grouped);
    });

    return unsubscribe;
  }, []);

  const handleToggle = (id) => {
    setOpenMap(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      const allIds = getAllFolderIds(folders);
      setIsAllExpanded(allIds.every(folderId => updated[folderId]));
      return updated;
    });
  };

  const handleToggleAll = () => {
    const newExpanded = !isAllExpanded;
    setIsAllExpanded(newExpanded);
    const allIds = getAllFolderIds(folders);
    setOpenMap(allIds.reduce((acc, id) => ({ ...acc, [id]: newExpanded }), {}));
  };

  const renderFolders = (folderList, level = 0) => {
    return folderList.map(folder => {
      const hasChildren = folder.children?.length > 0;
      const isOpen = openMap[folder.id] || false;
      const files = folderFilesMap[folder.id] || [];

      return (
        <React.Fragment key={folder.id}>
          <ListItemButton
            selected={selected === folder.id}
            onClick={() => onSelect(folder)}
            sx={{
              pl: 2 + level * 2,
              bgcolor: selected === folder.id ? '#1976d2' : 'transparent',
              color: selected === folder.id ? '#fff' : 'inherit',
              '&:hover': {
                bgcolor: selected === folder.id ? '#1565c0' : '#e0e0e0',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#FFD700' }}>
              {folder.locked ? <LockIcon fontSize="small" /> : <FolderIcon />}
            </ListItemIcon>
            <ListItemText primary={folder.name} />
            {(hasChildren || files.length > 0) ? (
              isOpen ? (
                <ExpandLess onClick={(e) => { e.stopPropagation(); handleToggle(folder.id); }} />
              ) : (
                <ExpandMore onClick={(e) => { e.stopPropagation(); handleToggle(folder.id); }} />
              )
            ) : null}
          </ListItemButton>

          {(hasChildren || files.length > 0) && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List disablePadding>
                {renderFolders(folder.children, level + 1)}
                {files.map(file => (
                  <ListItemButton
                    key={file.id}
                    sx={{ pl: 4 + level * 2 }}
                    onClick={() => onSelect({ ...file, isFile: true })}
                  >
                    <ListItemIcon sx={{ color: '#757575' }}>
                      <InsertDriveFileIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={file.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <Box sx={{ width: 500, bgcolor: '#f0f0f0', height: '100vh', overflowY: 'auto' }}>
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight="bold">Folders</Typography>
        <Tooltip title={isAllExpanded ? 'Collapse All' : 'Expand All'}>
          <IconButton
            onClick={handleToggleAll}
            size="small"
            disabled={!folders.some(folder => folder.children?.length > 0)}
          >
            {isAllExpanded ? <CollapseAllIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <List>
        {folders.length > 0 ? (
          renderFolders(folders)
        ) : (
          <ListItemText
            primary={<Typography variant="body2" color="textSecondary">No folders available</Typography>}
            sx={{ pl: 2 }}
          />
        )}
      </List>
    </Box>
  );
}
