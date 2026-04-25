/**
 * Storage Manager — localStorage abstraction with JSON serialization.
 */
export class StorageManager {
  constructor(prefix = 'lc_') {
    this.prefix = prefix;
  }

  _key(key) {
    return `${this.prefix}${key}`;
  }

  save(key, data) {
    try {
      localStorage.setItem(this._key(key), JSON.stringify(data));
      return true;
    } catch (e) {
      console.error(`[Storage] Failed to save "${key}":`, e);
      return false;
    }
  }

  load(key) {
    try {
      const raw = localStorage.getItem(this._key(key));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error(`[Storage] Failed to load "${key}":`, e);
      return null;
    }
  }

  delete(key) {
    localStorage.removeItem(this._key(key));
  }

  clear() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(this.prefix));
    keys.forEach(k => localStorage.removeItem(k));
  }

  exists(key) {
    return localStorage.getItem(this._key(key)) !== null;
  }
}

export const storage = new StorageManager();
