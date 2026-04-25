/**
 * OnboardingView — Welcome screen, name input, skill level selection.
 */
import { UserProfile } from '../models/UserProfile.js';
import { LearningState } from '../models/LearningState.js';
import { storage } from '../storage/StorageManager.js';

export class OnboardingView {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.selectedLevel = null;
  }

  render() {
    return `
      <div class="view onboarding-view" id="onboarding-view">
        <div class="onboarding-container">
          <!-- Step 1: Welcome -->
          <div class="onboarding-step onboarding-step--active" id="onboard-step-1">
            <div class="onboarding-hero">
              <div class="onboarding-logo">
                <span class="logo-icon">🧠</span>
                <span class="logo-glow"></span>
              </div>
              <h1 class="onboarding-title">Learning Companion</h1>
              <p class="onboarding-subtitle">Your intelligent, adaptive learning partner.<br>Master concepts at your own pace.</p>
            </div>
            <button class="btn btn--primary btn--lg" id="btn-get-started">Get Started</button>
          </div>

          <!-- Step 2: Name -->
          <div class="onboarding-step" id="onboard-step-2">
            <h2 class="onboarding-heading">What should we call you?</h2>
            <p class="onboarding-text">We'll personalize your learning experience.</p>
            <div class="input-group">
              <input type="text" class="input" id="input-name" placeholder="Enter your name" maxlength="30" autocomplete="off"/>
            </div>
            <button class="btn btn--primary btn--lg" id="btn-name-next" disabled>Continue</button>
          </div>

          <!-- Step 3: Skill Level -->
          <div class="onboarding-step" id="onboard-step-3">
            <h2 class="onboarding-heading">What's your experience level?</h2>
            <p class="onboarding-text">This helps us tailor content difficulty for you.</p>
            <div class="skill-cards" id="skill-cards">
              <button class="skill-card" data-level="beginner">
                <div class="skill-card__icon">🌱</div>
                <div class="skill-card__title">Beginner</div>
                <div class="skill-card__desc">New to programming, starting from scratch</div>
              </button>
              <button class="skill-card" data-level="intermediate">
                <div class="skill-card__icon">🌿</div>
                <div class="skill-card__title">Intermediate</div>
                <div class="skill-card__desc">Familiar with basics, ready to go deeper</div>
              </button>
              <button class="skill-card" data-level="advanced">
                <div class="skill-card__icon">🌳</div>
                <div class="skill-card__title">Advanced</div>
                <div class="skill-card__desc">Experienced, looking to fill gaps & master topics</div>
              </button>
            </div>
            <button class="btn btn--primary btn--lg" id="btn-skill-next" disabled>Start Learning</button>
          </div>

          <!-- Progress dots -->
          <div class="onboarding-dots">
            <span class="dot dot--active" data-step="1"></span>
            <span class="dot" data-step="2"></span>
            <span class="dot" data-step="3"></span>
          </div>
        </div>
      </div>`;
  }

  mount() {
    const step1 = document.getElementById('onboard-step-1');
    const step2 = document.getElementById('onboard-step-2');
    const step3 = document.getElementById('onboard-step-3');
    const dots = document.querySelectorAll('.onboarding-dots .dot');

    const goToStep = (num) => {
      [step1, step2, step3].forEach((s, i) => {
        s.classList.toggle('onboarding-step--active', i === num - 1);
      });
      dots.forEach((d, i) => d.classList.toggle('dot--active', i < num));
      if (num === 2) setTimeout(() => document.getElementById('input-name')?.focus(), 400);
    };

    // Step 1 → 2
    document.getElementById('btn-get-started').addEventListener('click', () => goToStep(2));

    // Step 2: Name input
    const nameInput = document.getElementById('input-name');
    const nameBtn = document.getElementById('btn-name-next');
    nameInput.addEventListener('input', () => {
      nameBtn.disabled = nameInput.value.trim().length === 0;
    });
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && nameInput.value.trim()) goToStep(3);
    });
    nameBtn.addEventListener('click', () => goToStep(3));

    // Step 3: Skill level
    const skillCards = document.getElementById('skill-cards');
    const skillBtn = document.getElementById('btn-skill-next');
    skillCards.addEventListener('click', (e) => {
      const card = e.target.closest('.skill-card');
      if (!card) return;
      document.querySelectorAll('.skill-card').forEach(c => c.classList.remove('skill-card--selected'));
      card.classList.add('skill-card--selected');
      this.selectedLevel = card.dataset.level;
      skillBtn.disabled = false;
    });

    // Complete onboarding
    skillBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const profile = new UserProfile({ name, skillLevel: this.selectedLevel });
      const state = new LearningState(profile.id);
      storage.save('profile', profile.toJSON());
      storage.save('learningState', state.toJSON());
      this.onComplete(profile, state);
    });
  }
}
