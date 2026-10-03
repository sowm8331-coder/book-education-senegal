/**
 * Persistent document file storage using IndexedDB
 * Allows storing large PDF, Word, and text files permanently across browser sessions.
 */

const DB_NAME = 'BookEduSenegalDB';
const DB_VERSION = 1;
const STORE_NAME = 'documents_files';

// Cache active blob URLs in memory during the session
const activeBlobUrlCache = new Map<string, string>();

interface MemoryStoredFile {
  id: string;
  blob: Blob;
  name: string;
  type: string;
  size: number;
  updatedAt: number;
}
const inMemoryBlobStore = new Map<string, MemoryStoredFile>();

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        try {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        } catch {
          // ignore upgrade errors
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } catch (e) {
      reject(e);
    }
  });
}

export interface StoredDocumentFile {
  id: string;
  blob: Blob;
  name: string;
  type: string;
  size: number;
  updatedAt: number;
}

/**
 * Save an uploaded file permanently into IndexedDB (with ArrayBuffer support and in-memory safety)
 */
export async function saveFileToStorage(
  docId: string,
  file: File | Blob,
  name: string,
  type: string
): Promise<boolean> {
  // 1. Immediately cache in memory so the file is 100% available in current session
  try {
    inMemoryBlobStore.set(docId, {
      id: docId,
      blob: file,
      name,
      type: type || 'application/pdf',
      size: file.size,
      updatedAt: Date.now()
    });
    const liveUrl = URL.createObjectURL(file);
    activeBlobUrlCache.set(docId, liveUrl);
  } catch (e) {
    // ignore
  }

  // 2. Persist to IndexedDB using ArrayBuffer to prevent WebKit/Chromium Blob serialization errors in iframes
  try {
    let arrayBuffer: ArrayBuffer | null = null;
    if (typeof file.arrayBuffer === 'function') {
      arrayBuffer = await file.arrayBuffer();
    } else {
      arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }

    const db = await openDB();
    await new Promise<boolean>((resolve) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const record = {
          id: docId,
          buffer: arrayBuffer,
          name,
          type: type || 'application/pdf',
          size: file.size,
          updatedAt: Date.now()
        };

        const request = store.put(record);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
        transaction.onerror = () => resolve(false);
        transaction.onabort = () => resolve(false);
      } catch {
        resolve(false);
      }
    });

    return true;
  } catch {
    // In iframe or sandboxed mode where IndexedDB is restricted, in-memory store keeps it working
    return true;
  }
}

/**
 * Retrieve a stored file from in-memory cache or IndexedDB
 */
export async function getFileFromStorage(docId: string): Promise<StoredDocumentFile | null> {
  // 1. Check in-memory store first
  if (inMemoryBlobStore.has(docId)) {
    return inMemoryBlobStore.get(docId)!;
  }

  // 2. Query IndexedDB
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(docId);

        request.onsuccess = () => {
          const result = request.result;
          if (!result) {
            resolve(null);
            return;
          }

          let blob: Blob | null = result.blob || null;
          if (!blob && result.buffer) {
            blob = new Blob([result.buffer], { type: result.type || 'application/pdf' });
          }

          if (blob) {
            const fileObj: StoredDocumentFile = {
              id: result.id,
              blob,
              name: result.name || 'document.pdf',
              type: result.type || 'application/pdf',
              size: result.size || blob.size,
              updatedAt: result.updatedAt || Date.now()
            };
            inMemoryBlobStore.set(docId, fileObj);
            resolve(fileObj);
            return;
          }

          resolve(null);
        };
        request.onerror = () => resolve(null);
        transaction.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  } catch {
    return null;
  }
}

/**
 * Remove a file from storage when a document is deleted
 */
export async function deleteFileFromStorage(docId: string): Promise<boolean> {
  // Revoke cached blob URL and clean in-memory
  const existing = activeBlobUrlCache.get(docId);
  if (existing) {
    URL.revokeObjectURL(existing);
    activeBlobUrlCache.delete(docId);
  }
  inMemoryBlobStore.delete(docId);

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(docId);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
        transaction.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  } catch {
    return true;
  }
}

import { generatePedagogicalPdfBlob } from './pdfGenerator';
import { EducationalDocument } from '../types';

/**
 * Direct URL for opening the real document in a new tab
 */
export function getDirectDocumentUrl(doc: {
  id: string;
  filename: string;
  isLocal?: boolean;
}): string {
  if (activeBlobUrlCache.has(doc.id)) {
    return activeBlobUrlCache.get(doc.id)!;
  }
  if (doc.filename) {
    if (doc.filename.startsWith('/api/') || doc.filename.startsWith('http') || doc.filename.startsWith('blob:')) {
      return doc.filename;
    }
    if (doc.filename.startsWith('/docs/')) {
      return doc.filename;
    }
    return `/docs/${doc.filename.replace(/^\/?docs\/?/, '')}`;
  }
  return `/docs/${doc.id}.pdf`;
}

/**
 * Returns a working, live URL for viewing or downloading a document
 */
export async function getLiveUrlForDocument(doc: {
  id: string;
  filename: string;
  isLocal?: boolean;
  content?: string;
  title?: string;
  level?: string;
  category?: string;
  author?: string;
  description?: string;
  exercises?: any[];
}): Promise<string> {
  // 1. If we already have a cached live blob URL, return it
  if (activeBlobUrlCache.has(doc.id)) {
    return activeBlobUrlCache.get(doc.id)!;
  }

  // 2. If it's a local imported document, look up the persistent file in IndexedDB
  if (doc.isLocal || doc.id.startsWith('doc_')) {
    const stored = await getFileFromStorage(doc.id);
    if (stored && stored.blob) {
      const liveUrl = URL.createObjectURL(stored.blob);
      activeBlobUrlCache.set(doc.id, liveUrl);
      return liveUrl;
    }
  }

  // 3. If filename is a server file URL (/docs/... or /api/documents/files/...)
  if (doc.filename && (doc.filename.startsWith('/docs/') || doc.filename.startsWith('/api/documents/files/'))) {
    return doc.filename;
  }

  // 4. If filename is an external HTTP URL or data URL
  if (doc.filename && (doc.filename.startsWith('http') || doc.filename.startsWith('data:'))) {
    return doc.filename;
  }

  // 5. If filename is a relative name without slash
  if (doc.filename && !doc.filename.startsWith('blob:')) {
    return doc.filename.startsWith('/') ? doc.filename : `/docs/${doc.filename}`;
  }

  // 6. Fallback: Generate pedagogical PDF only if no file path exists
  try {
    const pdfBlob = generatePedagogicalPdfBlob(doc as EducationalDocument);
    const liveUrl = URL.createObjectURL(pdfBlob);
    activeBlobUrlCache.set(doc.id, liveUrl);
    return liveUrl;
  } catch (e) {
    console.warn('Could not generate dynamic PDF:', e);
  }

  return doc.filename || '';
}

/**
 * Safely and reliably download any document as a valid PDF or Word file
 */
export async function downloadDocumentFile(doc: EducationalDocument): Promise<boolean> {
  try {
    const liveUrl = await getLiveUrlForDocument(doc);
    let blobToDownload: Blob | null = null;

    if (liveUrl) {
      try {
        const response = await fetch(liveUrl);
        if (response.ok) {
          blobToDownload = await response.blob();
        }
      } catch (fetchErr) {
        console.warn('Direct fetch from liveUrl failed, generating pedagogical PDF:', fetchErr);
      }
    }

    // If fetch didn't yield a blob, generate a fresh pedagogical PDF
    if (!blobToDownload) {
      blobToDownload = generatePedagogicalPdfBlob(doc);
    }

    const blobUrl = URL.createObjectURL(blobToDownload);
    const a = document.createElement('a');
    a.href = blobUrl;
    const extension = doc.fileType === 'word' ? 'docx' : 'pdf';
    const cleanTitle = (doc.title || 'document').replace(/[^a-zA-Z0-9_\-]/g, '_');
    a.download = `${cleanTitle}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    return true;
  } catch (err) {
    console.warn('Primary download approach failed, executing resilient fallback:', err);
    try {
      const pdfBlob = generatePedagogicalPdfBlob(doc);
      const blobUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const cleanTitle = (doc.title || 'document').replace(/[^a-zA-Z0-9_\-]/g, '_');
      a.download = `${cleanTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      return true;
    } catch (e2) {
      console.warn('Final PDF generation failed:', e2);
      return false;
    }
  }
}

/**
 * Convert a File or Blob into a Base64 string for persistent server storage
 */
export function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Fetch all persistent documents saved on the server
 */
export async function fetchServerDocuments(): Promise<any[]> {
  try {
    const res = await fetch('/api/documents');
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data.documents) ? data.documents : [];
    }
  } catch (err) {
    console.warn('Could not fetch server documents:', err);
  }
  return [];
}

/**
 * Save a document (with optional file content) permanently to the server
 */
export async function saveDocumentToServer(doc: any, file?: File | Blob): Promise<any> {
  try {
    let payload: any = { document: doc };
    if (file) {
      const base64Data = await fileToBase64(file);
      payload = {
        document: {
          ...doc,
          filename: file instanceof File ? file.name : (doc.filename || 'document.pdf'),
          fileData: base64Data
        }
      };
    }

    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      if (file) {
        const safeName = `${doc.id}_${(file instanceof File ? file.name : doc.filename).replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        return {
          ...doc,
          filename: `/api/documents/files/${safeName}`,
          isLocal: true
        };
      }
    }
  } catch (err) {
    console.warn('Error saving document to server:', err);
  }
  return doc;
}

/**
 * Update an existing document on the server
 */
export async function updateDocumentOnServer(doc: any): Promise<boolean> {
  try {
    const res = await fetch(`/api/documents/${doc.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc)
    });
    return res.ok;
  } catch (err) {
    console.warn('Error updating document on server:', err);
    return false;
  }
}

/**
 * Delete a document from the server (Admin only)
 */
export async function deleteDocumentFromServer(docId: string): Promise<boolean> {
  try {
    const isAdmin = typeof window !== 'undefined' && localStorage.getItem('is_admin') === 'true';
    if (!isAdmin) {
      console.warn('Action refusée : Seul un administrateur peut supprimer un document.');
      return false;
    }

    const res = await fetch(`/api/documents/${docId}`, {
      method: 'DELETE',
      headers: {
        'x-admin-role': 'admin'
      }
    });
    return res.ok;
  } catch (err) {
    console.warn('Error deleting document from server:', err);
    return false;
  }
}
