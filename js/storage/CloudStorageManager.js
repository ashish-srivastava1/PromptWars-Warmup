import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { cloudConfig } from '../config/cloudConfig.js';
import { StorageManager } from './StorageManager.js';

/**
 * Cloud Storage Manager — Replaces localStorage with Firestore when enabled.
 * Gracefully falls back to localStorage if Firebase fails or is disabled.
 */
export class CloudStorageManager extends StorageManager {
  constructor(prefix = 'lc_') {
    super(prefix);
    this.useCloud = false;
    this.db = null;

    if (cloudConfig.enableCloudStorage && cloudConfig.firebase.apiKey !== 'AIzaSy_YOUR_API_KEY') {
      try {
        const app = initializeApp(cloudConfig.firebase);
        this.db = getFirestore(app);
        this.useCloud = true;
        console.log('[CloudStorage] Connected to Firestore');
      } catch (err) {
        console.warn('[CloudStorage] Failed to initialize Firebase, falling back to localStorage:', err);
      }
    } else {
      console.log('[CloudStorage] Cloud storage disabled or unconfigured, using localStorage.');
    }
  }

  // We need async methods for cloud storage. 
  // To avoid breaking the existing synchronous app flow drastically, we can implement 
  // fire-and-forget saves, but loading needs to be awaited if we want cloud data.
  // The app currently uses synchronous load() in init().

  /**
   * Save data. Fire-and-forget for cloud to prevent blocking UI.
   */
  save(key, data) {
    // Always save to local storage as a cache/fallback
    super.save(key, data);

    if (this.useCloud && this.db) {
      // Background sync to Firestore
      // For a real app, we'd use a real user ID. Here we use 'default_user'
      const userId = data.userId || 'default_user';
      const docRef = doc(this.db, 'users', userId, 'data', key);
      
      setDoc(docRef, data).catch(err => {
        console.error(`[CloudStorage] Failed to sync "${key}" to Firestore:`, err);
      });
    }
    return true;
  }

  /**
   * Load data. Synchronously returns local cache.
   * A real implementation would await the cloud fetch.
   */
  load(key) {
    return super.load(key);
  }

  /**
   * Async load to explicitly fetch from cloud if needed.
   */
  async loadFromCloud(userId, key) {
    if (!this.useCloud || !this.db) return super.load(key);

    try {
      const docRef = doc(this.db, 'users', userId, 'data', key);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        super.save(key, data); // update local cache
        return data;
      }
    } catch (err) {
      console.error(`[CloudStorage] Failed to load "${key}" from Firestore:`, err);
    }
    return super.load(key);
  }
}

export const cloudStorage = new CloudStorageManager();
