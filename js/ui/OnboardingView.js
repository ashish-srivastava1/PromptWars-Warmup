/**
 * OnboardingView — Welcome screen, name input, skill level selection.
 */
import { UserProfile } from '../models/UserProfile.js';
import { LearningState } from '../models/LearningState.js';
import { storage } from '../storage/StorageManager.js';
import { SecurityUtils } from '../utils/SecurityUtils.js';
import { logger } from '../utils/CloudLogger.js';

export class OnboardingView {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.selectedLevel = null;
    this.logger = new logger.constructor('OnboardingView');
  }

  render() {
    return `
      <main class="view onboarding-view" id="onboarding-view" role="main">
        <div class="onboarding-container">
          <!-- Step 1: Welcome -->
          <section class="onboarding-step onboarding-step--active" id="onboard-step-1" aria-labelledby="step1-title">
            <div class="onboarding-hero">
              <div class="onboarding-logo" aria-hidden="true">
                <span class="logo-icon">🧠</span>
                <span class="logo-glow"></span>
              </div>
              <h1 class="onboarding-title" id="step1-title">Learning Companion</h1>
              <p class="onboarding-subtitle">Your intelligent, adaptive learning partner.<br>Master concepts at your own pace.</p>
            </div>
            <button class="btn btn--primary btn--lg" id="btn-get-started" aria-label="Start onboarding">Get Started</button>
          </section>

          <!-- Step 2: Name -->
          <section class="onboarding-step" id="onboard-step-2" aria-labelledby="step2-title">
            <h2 class="onboarding-heading" id="step2-title">What should we call you?</h2>
            <p class="onboarding-text">We'll personalize your learning experience.</p>
            <div class="input-group">
              <label for="input-name" class="sr-only">Your Name</label>
              <input type="text" 
                     class="input" 
                     id="input-name" 
                     placeholder="Enter your name" 
                     maxlength="30" 
                     autocomplete="name"
                     aria-describedby="name-hint"/>
              <p id="name-hint" class="sr-only">Enter 2-30 alphanumeric characters.</p>
            </div>
            <button class="btn btn--primary btn--lg" id="btn-name-next" disabled>Continue</button>
          </section>

          <!-- Step 3: Skill Level -->
          <section class="onboarding-step" id="onboard-step-3" aria-labelledby="step3-title">
            <h2 class="onboarding-heading" id="step3-title">What's your experience level?</h2>
            <p class="onboarding-text">This helps us tailor content difficulty for you.</p>
            <div class="skill-cards" id="skill-cards" role="radiogroup" aria-labelledby="step3-title">
              <button class="skill-card" data-level="beginner" role="radio" aria-checked="false">
                <div class="skill-card__icon" aria-hidden="true">🌱</div>
                <div class="skill-card__title">Beginner</div>
                <div class="skill-card__desc">New to programming, starting from scratch</div>
              </button>
              <button class="skill-card" data-level="intermediate" role="radio" aria-checked="false">
                <div class="skill-card__icon" aria-hidden="true">🌿</div>
                <div class="skill-card__title">Intermediate</div>
                <div class="skill-card__desc">Familiar with basics, ready to go deeper</div>
              </button>
              <button class="skill-card" data-level="advanced" role="radio" aria-checked="false">
                <div class="skill-card__icon" aria-hidden="true">🌳</div>
                <div class="skill-card__title">Advanced</div>
                <div class="skill-card__desc">Experienced, looking to fill gaps & master topics</div>
              </button>
            </div>
            <button class="btn btn--primary btn--lg" id="btn-skill-next" disabled>Start Learning</button>
          </section>

          <!-- Progress dots -->
          <nav class="onboarding-dots" aria-label="Onboarding progress">
            <span class="dot dot--active" data-step="1" aria-current="step"></span>
            <span class="dot" data-step="2"></span>
            <span class="dot" data-step="3"></span>
          </nav>
        </div>
      </main>`;
  }

  mount() {
    const step1 = document.getElementById('onboard-step-1');
    const step2 = document.getElementById('onboard-step-2');
    const step3 = document.getElementById('onboard-step-3');
    const dots = document.querySelectorAll('.onboarding-dots .dot');

    const goToStep = (num) => {
      this.logger.info(`Navigating to onboarding step ${num}`);
      [step1, step2, step3].forEach((s, i) => {
        s.classList.toggle('onboarding-step--active', i === num - 1);
      });
      dots.forEach((d, i) => {
        const isActive = i === num - 1;
        d.classList.toggle('dot--active', i < num);
        if (isActive) d.setAttribute('aria-current', 'step');
        else d.removeAttribute('aria-current');
      });
      
      // Focus management
      if (num === 2) setTimeout(() => document.getElementById('input-name')?.focus(), 400);
      if (num === 3) setTimeout(() => document.querySelector('.skill-card')?.focus(), 400);
    };

    // Step 1 → 2
    document.getElementById('btn-get-started').addEventListener('click', () => goToStep(2));

    // Step 2: Name input
    const nameInput = document.getElementById('input-name');
    const nameBtn = document.getElementById('btn-name-next');
    nameInput.addEventListener('input', () => {
      const isValid = SecurityUtils.validateUsername(nameInput.value);
      nameBtn.disabled = !isValid;
    });
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !nameBtn.disabled) goToStep(3);
    });
    nameBtn.addEventListener('click', () => goToStep(3));

    // Step 3: Skill level
    const skillCards = document.getElementById('skill-cards');
    const skillBtn = document.getElementById('btn-skill-next');
    skillCards.addEventListener('click', (e) => {
      const card = e.target.closest('.skill-card');
      if (!card) return;
      document.querySelectorAll('.skill-card').forEach(c => {
        c.classList.remove('skill-card--selected');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('skill-card--selected');
      card.setAttribute('aria-checked', 'true');
      this.selectedLevel = card.dataset.level;
      skillBtn.disabled = false;
      this.logger.info('Skill level selected', { level: this.selectedLevel });
    });

    // Complete onboarding
    skillBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      this.logger.info('Completing onboarding', { name });
      const profile = new UserProfile({ name, skillLevel: this.selectedLevel });
      const state = new LearningState(profile.id);
      storage.save('profile', profile.toJSON());
      storage.save('learningState', state.toJSON());
      this.onComplete(profile, state);
    });
  }
}
