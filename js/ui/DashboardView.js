/**
 * DashboardView — Progress overview, topic selection, weak areas, stats.
 */
import { Components } from './Components.js';
import { CURRICULUM, getAllConcepts } from '../data/curriculum.js';
import { recommender } from '../engine/Recommender.js';
import { evaluator } from '../engine/Evaluator.js';

export class DashboardView {
  constructor(userProfile, onStartTopic, onLogout) {
    this.profile = userProfile;
    this.onStartTopic = onStartTopic;
    this.onLogout = onLogout;
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
        <nav class="dashboard-nav">
          <div class="dashboard-nav__brand">
            <span class="logo-icon-sm">🧠</span>
            <span>Learning Companion</span>
          </div>
          <div class="dashboard-nav__user">
            <span class="dashboard-nav__greeting">Hey, ${this.profile.name}!</span>
            <button class="btn btn--ghost btn--sm" id="btn-reset">Reset</button>
          </div>
        </nav>

        <main class="dashboard-main">
          <!-- Stats Row -->
          <section class="dashboard-section stats-row">
            ${Components.progressRing(overallMastery, 130, 10, 'Overall')}
            <div class="stats-grid">
              ${Components.statCard('🔥', this.profile.streakDays, 'Day Streak')}
              ${Components.statCard('📖', this.profile.sessionsCompleted, 'Sessions')}
              ${Components.statCard('🎯', this.profile.accuracy + '%', 'Accuracy')}
              ${Components.statCard('⭐', strongAreas.length, 'Mastered')}
            </div>
          </section>

          <!-- Topics -->
          <section class="dashboard-section">
            <h2 class="section-title">Your Learning Path</h2>
            <div class="topics-grid" id="topics-grid">
              ${topics.map(t => {
                const progress = recommender._getTopicProgress ? t.progress : { percentage: 0, mastered: 0, total: t.concepts.length };
                return Components.topicCard(t, progress, !t.prereqsMet);
              }).join('')}
            </div>
          </section>

          <!-- Weak Areas -->
          ${weakAreas.length > 0 ? `
          <section class="dashboard-section">
            <h2 class="section-title">Needs Review</h2>
            <div class="review-list">
              ${weakAreas.slice(0, 4).map(w => {
                const concept = allConcepts.find(c => c.id === w.conceptId);
                if (!concept) return '';
                const accuracy = w.attempts > 0 ? Math.round((w.correct / w.attempts) * 100) : 0;
                return `
                  <div class="review-card" data-topic-id="${concept.topicId}">
                    <div class="review-card__info">
                      <span class="review-card__title">${concept.title}</span>
                      <span class="review-card__topic">${concept.topicTitle}</span>
                    </div>
                    <div class="review-card__stats">
                      ${Components.masteryBadge(w.level)}
                      <span class="review-card__accuracy">${accuracy}%</span>
                    </div>
                  </div>`;
              }).join('')}
            </div>
          </section>` : ''}

          <!-- Strong Areas -->
          ${strongAreas.length > 0 ? `
          <section class="dashboard-section">
            <h2 class="section-title">Your Strengths 💪</h2>
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
      const btn = e.target.closest('.topic-card__btn');
      if ((card && btn) || (card && e.target === card)) {
        this.onStartTopic(card.dataset.topicId);
      }
    });

    // Review card clicks
    document.querySelectorAll('.review-card').forEach(card => {
      card.addEventListener('click', () => this.onStartTopic(card.dataset.topicId));
    });

    // Reset button
    document.getElementById('btn-reset')?.addEventListener('click', () => {
      if (confirm('Reset all progress? This cannot be undone.')) {
        this.onLogout();
      }
    });
  }
}
