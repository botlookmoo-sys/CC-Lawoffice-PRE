
const DB_NAME = 'ChanaChaiLawDB';
const DB_VERSION = 1;
const FILE_STORE = 'files';

// Initialize the Database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(FILE_STORE)) {
        db.createObjectStore(FILE_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Save a file and return its ID
export const saveFileToDB = async (file: File): Promise<string> => {
  try {
    const db = await initDB();
    const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transaction = db.transaction(FILE_STORE, 'readwrite');
    const store = transaction.objectStore(FILE_STORE);
    
    // Store metadata along with the blob
    const fileData = {
        id,
        blob: file,
        name: file.name,
        type: file.type,
        createdAt: new Date().toISOString()
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(fileData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    return id;
  } catch (error) {
    console.error("DB Save Error:", error);
    // Fallback if DB fails (though rarely happens)
    return URL.createObjectURL(file);
  }
};

// Get a file blob by ID
export const getFileFromDB = async (id: string): Promise<File | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FILE_STORE, 'readonly');
      const store = transaction.objectStore(FILE_STORE);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result ? request.result.blob : null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("DB Get Error:", error);
    return null;
  }
};

// Helper to create a temporary URL for viewing
export const getFileUrl = async (idOrUrl: string): Promise<string | null> => {
    if (!idOrUrl) return null;
    
    // If it's already a URL (http/https/data), return it
    if (idOrUrl.startsWith('http') || idOrUrl.startsWith('data:') || idOrUrl.startsWith('blob:')) {
        return idOrUrl;
    }

    // Otherwise, try to fetch from DB
    const file = await getFileFromDB(idOrUrl);
    if (file) {
        return URL.createObjectURL(file);
    }
    return null;
};
