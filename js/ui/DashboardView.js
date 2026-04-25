/**
 * DashboardView — Progress overview, topic selection, weak areas, stats.
 */
import { Components } from './Components.js';
import { CURRICULUM, getAllConcepts } from '../data/curriculum.js';
import { recommender } from '../engine/Recommender.js';
import { evaluator } from '../engine/Evaluator.js';
import { logger } from '../utils/CloudLogger.js';

export class DashboardView {
  constructor(userProfile, onStartTopic, onLogout) {
    this.profile = userProfile;
    this.onStartTopic = onStartTopic;
    this.onLogout = onLogout;
    this.logger = new logger.constructor('DashboardView');
  }

  render() {
    const allConcepts = getAllConcepts();
    const conceptIds = allConcepts.map(c => c.id);
    const overallMastery = evaluator.calculateOverallMastery(this.profile.conceptMastery, conceptIds);
    const topics = recommender.getSuggestedTopics(this.profile);
    const weakAreas = this.profile.getWeakAreas();
    const strongAreas = this.profile.getStrongAreas();

    return `
      <div class="view dashboard-view" id="dashboard-view">
        <nav class="dashboard-nav" role="navigation" aria-label="Main navigation">
          <div class="dashboard-nav__brand">
            <span class="logo-icon-sm" aria-hidden="true">🧠</span>
            <span>Learning Companion</span>
          </div>
          <div class="dashboard-nav__user">
            <span class="dashboard-nav__greeting">Hey, ${this.profile.name}!</span>
            <button class="btn btn--ghost btn--sm" id="btn-reset" aria-label="Reset all progress and logout">Reset</button>
          </div>
        </nav>

        <main class="dashboard-main" role="main">
          <!-- Stats Row -->
          <section class="dashboard-section stats-row" aria-label="Quick Stats">
            ${Components.progressRing(overallMastery, 130, 10, 'Overall')}
            <div class="stats-grid">
              ${Components.statCard('🔥', this.profile.streakDays, 'Day Streak')}
              ${Components.statCard('📖', this.profile.sessionsCompleted, 'Sessions')}
              ${Components.statCard('🎯', this.profile.accuracy + '%', 'Accuracy')}
              ${Components.statCard('⭐', strongAreas.length, 'Mastered')}
            </div>
          </section>

          <!-- Topics -->
          <section class="dashboard-section" aria-labelledby="learning-path-title">
            <h2 class="section-title" id="learning-path-title">Your Learning Path</h2>
            <div class="topics-grid" id="topics-grid">
              ${topics.map(t => {
                const progress = recommender._getTopicProgress ? t.progress : { percentage: 0, mastered: 0, total: t.concepts.length };
                return Components.topicCard(t, progress, !t.prereqsMet);
              }).join('')}
            </div>
          </section>

          <!-- Weak Areas -->
          ${weakAreas.length > 0 ? `
          <section class="dashboard-section" aria-labelledby="weak-areas-title">
            <h2 class="section-title" id="weak-areas-title">Needs Review</h2>
            <div class="review-list">
              ${weakAreas.slice(0, 4).map(w => {
                const concept = allConcepts.find(c => c.id === w.conceptId);
                if (!concept) return '';
                const accuracy = w.attempts > 0 ? Math.round((w.correct / w.attempts) * 100) : 0;
                return `
                  <div class="review-card" data-topic-id="${concept.topicId}" role="button" tabindex="0" aria-label="Review ${concept.title} from ${concept.topicTitle}">
                    <div class="review-card__info">
                      <span class="review-card__title">${concept.title}</span>
                      <span class="review-card__topic">${concept.topicTitle}</span>
                    </div>
                    <div class="review-card__stats">
                      ${Components.masteryBadge(w.level)}
                      <span class="review-card__accuracy">${accuracy}% accuracy</span>
                    </div>
                  </div>`;
              }).join('')}
            </div>
          </section>` : ''}

          <!-- Strong Areas -->
          ${strongAreas.length > 0 ? `
          <section class="dashboard-section" aria-labelledby="strengths-title">
            <h2 class="section-title" id="strengths-title">Your Strengths 💪</h2>
            <div class="strengths-row">
              ${strongAreas.map(s => {
                const concept = allConcepts.find(c => c.id === s.conceptId);
                return concept ? `<div class="strength-chip">${concept.title} ${Components.masteryBadge(s.level)}</div>` : '';
              }).join('')}
            </div>
          </section>` : ''}
        </main>
      </div>`;
  }

  mount() {
    // Topic card clicks
    document.getElementById('topics-grid')?.addEventListener('click', (e) => {
      const card = e.target.closest('.topic-card:not(.topic-card--locked)');
      if (card) {
        this.logger.info('Starting topic from dashboard', { topicId: card.dataset.topicId });
        this.onStartTopic(card.dataset.topicId);
      }
    });

    // Review card clicks
    document.querySelectorAll('.review-card').forEach(card => {
      card.addEventListener('click', () => {
        this.logger.info('Reviewing concept', { topicId: card.dataset.topicId });
        this.onStartTopic(card.dataset.topicId);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Reset button with two-step confirmation for better UX/A11Y
    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (resetBtn.dataset.confirming === 'true') {
          this.logger.warn('User confirmed app reset');
          this.onLogout();
        } else {
          this.logger.info('Reset triggered - waiting for confirmation');
          resetBtn.dataset.confirming = 'true';
          resetBtn.textContent = 'Confirm Reset?';
          resetBtn.classList.remove('btn--ghost');
          resetBtn.classList.add('btn--primary');
          
          // Reset button state if not clicked again within 3 seconds
          setTimeout(() => {
            if (resetBtn.dataset.confirming === 'true') {
              resetBtn.dataset.confirming = 'false';
              resetBtn.textContent = 'Reset';
              resetBtn.classList.add('btn--ghost');
              resetBtn.classList.remove('btn--primary');
            }
          }, 3000);
        }
      });
    } else {
      console.error('[Dashboard] Reset button not found in DOM during mount()');
    }
  }
}
