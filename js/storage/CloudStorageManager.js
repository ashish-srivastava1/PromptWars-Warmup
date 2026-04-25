import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { cloudConfig } from '../config/cloudConfig.js';
import { StorageManager } from './StorageManager.js';
import { AsyncUtils } from '../utils/AsyncUtils.js';
import { authService } from '../utils/AuthService.js';
import { logger } from '../utils/CloudLogger.js';

/**
 * Cloud Storage Manager — Production-grade Firestore integration.
 */
export class CloudStorageManager extends StorageManager {
  constructor(prefix = 'lc_') {
    super(prefix);
    this.useCloud = false;
    this.db = null;
    this.logger = new logger.constructor('CloudStorageManager');

    if (cloudConfig.enableCloudStorage && cloudConfig.firebase.apiKey !== 'AIzaSy_YOUR_API_KEY') {
      try {
        const app = initializeApp(cloudConfig.firebase);
        this.db = getFirestore(app);
        this.useCloud = true;
        this.logger.info('Connected to Firestore');
      } catch (err) {
        this.logger.warn('Failed to initialize Firestore, falling back to localStorage', { err: err.message });
      }
    }
  }

  /**
   * Save data with retry logic and security context.
   */
  async save(key, data) {
    // Always save to local storage as a cache/fallback
    super.save(key, data);

    if (this.useCloud && this.db) {
      try {
        const user = await authService.ensureAuth();
        const userId = user?.uid || 'default_user';
        const docRef = doc(this.db, 'users', userId, 'data', key);
        
        await AsyncUtils.retry(async () => {
          await setDoc(docRef, data);
        }, { 
          onRetry: (err, attempt) => this.logger.warn(`Retry save "${key}"`, { attempt, err: err.message })
        });
        
        this.logger.info(`Synced "${key}" to Firestore`, { userId });
      } catch (err) {
        this.logger.error(`Failed to sync "${key}" after retries`, { err: err.message });
      }
    }
    return true;
  }

  /**
   * Async load with explicitly retry logic.
   */
  async loadFromCloud(key) {
    if (!this.useCloud || !this.db) return super.load(key);

    try {
      const user = await authService.ensureAuth();
      const userId = user?.uid || 'default_user';
      const docRef = doc(this.db, 'users', userId, 'data', key);
      
      const snap = await AsyncUtils.retry(async () => {
        return await getDoc(docRef);
      });

      if (snap.exists()) {
        const data = snap.data();
        super.save(key, data); // update local cache
        this.logger.info(`Loaded "${key}" from Firestore`);
        return data;
      }
    } catch (err) {
      this.logger.error(`Failed to load "${key}" from Firestore`, { err: err.message });
    }
    return super.load(key);
  }
}

export const cloudStorage = new CloudStorageManager();
