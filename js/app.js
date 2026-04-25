/**
 * App — Main application controller. Handles routing between views
 * and bootstrapping the session manager.
 */
import { UserProfile } from './models/UserProfile.js';
import { LearningState } from './models/LearningState.js';
import { SessionManager } from './engine/SessionManager.js';
import { cloudStorage as storage } from './storage/CloudStorageManager.js';
import { OnboardingView } from './ui/OnboardingView.js';
import { DashboardView } from './ui/DashboardView.js';
import { SessionView } from './ui/SessionView.js';
import { logger } from './utils/CloudLogger.js';

class App {
  constructor() {
    this.root = document.getElementById('app');
    this.profile = null;
    this.state = null;
    this.sessionManager = null;
    this.logger = new logger.constructor('App');
  }

  async init() {
    try {
      this.logger.info('Application initializing');
      
      // Try to restore from storage (async-ready)
      const savedProfile = storage.load('profile');
      const savedState = storage.load('learningState');

      if (savedProfile) {
        this.profile = UserProfile.fromJSON(savedProfile);
        this.state = savedState ? LearningState.fromJSON(savedState) : new LearningState(this.profile.id);
        this.logger.info('Restored session for user', { userId: this.profile.id });
        this.showDashboard();
      } else {
        this.showOnboarding();
      }
    } catch (err) {
      this.handleGlobalError(err);
    }
  }

  handleGlobalError(err) {
    this.logger.error('Critical application error', { error: err.message, stack: err.stack });
    this.root.innerHTML = `
      <div class="view error-view" role="alert">
        <div class="empty-state">
          <div class="empty-state__icon">⚠️</div>
          <h1 class="empty-state__title">Something went wrong</h1>
          <p>The application encountered an unexpected error. We've logged the details and are looking into it.</p>
          <button class="btn btn--primary btn--lg" onclick="window.location.reload()">Reload App</button>
        </div>
      </div>
    `;
  }

  _render(html) {
    this.root.innerHTML = html;
  }

  showOnboarding() {
    const view = new OnboardingView((profile, state) => {
      this.profile = profile;
      this.state = state;
      this.showDashboard();
    });
    this._render(view.render());
    view.mount();
  }

  showDashboard() {
    try {
      // Re-load fresh profile from storage in case it was updated
      const saved = storage.load('profile');
      if (saved) this.profile = UserProfile.fromJSON(saved);

      const view = new DashboardView(
        this.profile,
        (topicId) => this.showSession(topicId),
        () => this.resetApp()
      );
      this._render(view.render());
      view.mount();
    } catch (err) {
      this.handleGlobalError(err);
    }
  }

  showSession(topicId) {
    try {
      this.sessionManager = new SessionManager(this.profile, this.state);
      const view = new SessionView(
        this.sessionManager,
        () => this.showDashboard()
      );
      this._render(view.render());
      view.mount();
      view.startTopic(topicId);
    } catch (err) {
      this.handleGlobalError(err);
    }
  }

  async resetApp() {
    try {
      this.logger.warn('Resetting application state');
      storage.clear();
      this.profile = null;
      this.state = null;
      this.sessionManager = null;
      this.showOnboarding();
    } catch (err) {
      this.handleGlobalError(err);
    }
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init().catch(err => {
    console.error('Fatal boot error:', err);
  });
});
