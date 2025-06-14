import { db } from "../firebase";
import {
  ref,
  push,
  set,
  get,
  update,
  remove,
  onValue
} from "firebase/database";

//
// 🔁 Real-time FOLDER listener
//
export const listenToFolders = (callback) => {
  const folderRef = ref(db, 'folders');
  const unsubscribe = onValue(folderRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : {};
    callback(data);
  });
  return () => unsubscribe(); // Cleanup function for useEffect
};

//
// ✅ Create folder (supports nested folders via 'parentId')
//
export const createFolder = async (name, parentId = null) => {
  const newRef = push(ref(db, 'folders'));
  await set(newRef, {
    name,
    parentId,           // null = root folder
    createdAt: Date.now()
  });
  return newRef.key;
};

//
// ✅ Fetch all folders (flat list, nesting handled in UI using 'parentId')
//
export const fetchFolders = async () => {
  const snapshot = await get(ref(db, 'folders'));
  return snapshot.exists() ? snapshot.val() : {};
};

//
// ✅ Rename a folder
//
export const renameFolder = async (id, newName) => {
  return update(ref(db, `folders/${id}`), { name: newName });
};

//
// ✅ Delete a folder (does NOT recursively delete subfolders/files)
//
export const deleteFolder = async (id) => {
  return remove(ref(db, `folders/${id}`));
};

//
// ✅ Create a file (folderId = null means file is in root)
//
export const createFile = async (name, folderId = null, content = '') => {
  const newRef = push(ref(db, 'files'));
  await set(newRef, {
    name,
    folderId,
    content,
    createdAt: Date.now()
  });
  return newRef.key;
};

//
// ✅ Fetch all files
//
export const fetchFiles = async () => {
  const snapshot = await get(ref(db, 'files'));
  return snapshot.exists() ? snapshot.val() : {};
};

//
// ✅ Rename a file
//
export const renameFile = async (id, newName) => {
  return update(ref(db, `files/${id}`), { name: newName });
};

//
// ✅ Delete a file
//
export const deleteFile = async (id) => {
  return remove(ref(db, `files/${id}`));
};
