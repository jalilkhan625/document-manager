// src/utils/db.js
import { db } from "../firebase";
import { ref, push, set, get, update, remove } from "firebase/database";

// ✅ Create folder (supports nested structure using 'parent')
export const createFolder = async (name, parent = null) => {
  const newRef = push(ref(db, 'folders'));
  await set(newRef, {
    name,
    parent,           // null means root folder
    createdAt: Date.now()
  });
  return newRef.key;
};

// ✅ Fetch all folders (flat list, handle nesting in UI using 'parent' property)
export const fetchFolders = async () => {
  const snapshot = await get(ref(db, 'folders'));
  return snapshot.exists() ? snapshot.val() : {};
};

// ✅ Rename a folder
export const renameFolder = async (id, newName) => {
  return update(ref(db, `folders/${id}`), { name: newName });
};

// ✅ Delete a folder and optionally handle subfolders/files elsewhere
export const deleteFolder = async (id) => {
  return remove(ref(db, `folders/${id}`));
};

// ✅ Create a file (folderId = null means file is stored in root)
export const createFile = async (name, folderId = null, content = '') => {
  const newRef = push(ref(db, 'files'));
  await set(newRef, {
    name,
    folderId,         // null means not inside any folder
    content,
    createdAt: Date.now()
  });
  return newRef.key;
};

// ✅ Fetch all files
export const fetchFiles = async () => {
  const snapshot = await get(ref(db, 'files'));
  return snapshot.exists() ? snapshot.val() : {};
};

// ✅ Rename a file
export const renameFile = async (id, newName) => {
  return update(ref(db, `files/${id}`), { name: newName });
};

// ✅ Delete a file
export const deleteFile = async (id) => {
  return remove(ref(db, `files/${id}`));
};
