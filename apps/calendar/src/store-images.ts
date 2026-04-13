/**
 * IndexedDB storage for calendar images.
 * Stores user-selected photos keyed by year and slot (cover, 1-12).
 * Client-side only — bundled by esbuild into client.js.
 */

const DB_NAME = "calendar-images";
const DB_VERSION = 1;
const STORE_NAME = "images";

export interface StoredImage {
  key: string;
  blob: Blob;
  name: string;
  lastModified: number;
}

function openImageDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function imageKey(year: number, slot: string): string {
  return `${year}-${slot}`;
}

export async function storeImage(
  year: number,
  slot: string,
  file: File,
): Promise<void> {
  const db = await openImageDB();
  const record: StoredImage = {
    key: imageKey(year, slot),
    blob: file,
    name: file.name,
    lastModified: file.lastModified,
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadImage(
  year: number,
  slot: string,
): Promise<StoredImage | undefined> {
  const db = await openImageDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(imageKey(year, slot));
    req.onsuccess = () => resolve(req.result ?? undefined);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Load an image as an object URL for use in `<img src>` or CSS.
 * Caller MUST call `revokeImageUrl()` when done to free memory.
 */
export async function loadImageUrl(
  year: number,
  slot: string,
): Promise<string | undefined> {
  const record = await loadImage(year, slot);
  if (!record) return undefined;
  return URL.createObjectURL(record.blob);
}

/** Revoke an object URL returned by `loadImageUrl()` to free memory. */
export function revokeImageUrl(url: string): void {
  URL.revokeObjectURL(url);
}

export async function removeImage(
  year: number,
  slot: string,
): Promise<void> {
  const db = await openImageDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(imageKey(year, slot));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function listImages(
  year: number,
): Promise<{ slot: string; name: string }[]> {
  const db = await openImageDB();
  const prefix = `${year}-`;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => {
      const all = req.result as StoredImage[];
      const matches = all
        .filter((r) => r.key.startsWith(prefix))
        .map((r) => ({
          slot: r.key.slice(prefix.length),
          name: r.name,
        }));
      resolve(matches);
    };
    req.onerror = () => reject(req.error);
  });
}
