import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { cloudConfig } from '../config/cloudConfig.js';
import { logger } from '../utils/CloudLogger.js';

/**
 * AuthService — Production-grade auth wrapper.
 */
export class AuthService {
  constructor() {
    this.auth = null;
    this.currentUser = null;
    this.logger = new logger.constructor('AuthService');
    
    if (cloudConfig.firebase.apiKey !== 'AIzaSy_YOUR_API_KEY') {
      try {
        const app = initializeApp(cloudConfig.firebase);
        this.auth = getAuth(app);
        this._initListener();
      } catch (err) {
        this.logger.error('Failed to init Auth', { err: err.message });
      }
    }
  }

  _initListener() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      this.logger.info('Auth state changed', { uid: user?.uid });
    });
  }

  async ensureAuth() {
    if (this.currentUser) return this.currentUser;
    if (!this.auth) return null;
    
    try {
      this.logger.info('Performing anonymous sign-in');
      const cred = await signInAnonymously(this.auth);
      return cred.user;
    } catch (err) {
      this.logger.error('Anonymous sign-in failed', { err: err.message });
      return null;
    }
  }

  getUid() {
    return this.currentUser?.uid || 'anonymous_user';
  }
}

export const authService = new AuthService();
