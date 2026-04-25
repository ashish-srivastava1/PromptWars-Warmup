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

class App {
  constructor() {
    this.root = document.getElementById('app');
    this.profile = null;
    this.state = null;
    this.sessionManager = null;
  }

  init() {
    // Try to restore from localStorage
    const savedProfile = storage.load('profile');
    const savedState = storage.load('learningState');

    if (savedProfile) {
      this.profile = UserProfile.fromJSON(savedProfile);
      this.state = savedState ? LearningState.fromJSON(savedState) : new LearningState(this.profile.id);
      this.showDashboard();
    } else {
      this.showOnboarding();
    }
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
  }

  showSession(topicId) {
    this.sessionManager = new SessionManager(this.profile, this.state);
    const view = new SessionView(
      this.sessionManager,
      () => this.showDashboard()
    );
    this._render(view.render());
    view.mount();
    view.startTopic(topicId);
  }

  resetApp() {
    storage.clear();
    this.profile = null;
    this.state = null;
    this.sessionManager = null;
    this.showOnboarding();
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
