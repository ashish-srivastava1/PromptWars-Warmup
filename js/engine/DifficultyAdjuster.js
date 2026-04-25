/**
 * DifficultyAdjuster — Dynamically adjusts question difficulty based on
 * user performance using an SM-2 inspired algorithm.
 */
export class DifficultyAdjuster {
  constructor() {
    this.MIN_DIFFICULTY = 1;
    this.MAX_DIFFICULTY = 4;
  }

  /**
   * Calculate next difficulty level after an answer.
   * @param {object} mastery - The user's mastery record for a concept
   * @param {boolean} wasCorrect - Whether the answer was correct
   * @param {number} currentDifficulty - Current question difficulty (1-4)
   * @returns {number} Next difficulty level
   */
  calculateNextDifficulty(mastery, wasCorrect, currentDifficulty) {
    if (wasCorrect) {
      // Correct: potentially increase difficulty
      if (mastery.streak >= 2) {
        return Math.min(this.MAX_DIFFICULTY, currentDifficulty + 1);
      }
      return currentDifficulty;
    } else {
      // Incorrect: decrease difficulty
      return Math.max(this.MIN_DIFFICULTY, currentDifficulty - 1);
    }
  }

  /**
   * Determine the starting difficulty for a concept based on user profile.
   * @param {string} skillLevel - 'beginner' | 'intermediate' | 'advanced'
   * @param {object} mastery - Existing mastery record (may be fresh)
   * @param {number} conceptBaseDifficulty - The concept's inherent difficulty
   * @returns {number} Starting difficulty for questions
   */
  getStartingDifficulty(skillLevel, mastery, conceptBaseDifficulty) {
    const skillMap = { beginner: 1, intermediate: 2, advanced: 3 };
    const base = skillMap[skillLevel] || 1;

    // If user has history with this concept, use their level
    if (mastery && mastery.attempts > 0) {
      const accuracy = mastery.correct / mastery.attempts;
      if (accuracy >= 0.8) return Math.min(this.MAX_DIFFICULTY, mastery.level + 1);
      if (accuracy < 0.5) return Math.max(this.MIN_DIFFICULTY, mastery.level);
      return Math.max(this.MIN_DIFFICULTY, Math.min(this.MAX_DIFFICULTY, mastery.level));
    }

    // New concept: use skill level as guide, capped by concept difficulty
    return Math.min(base, conceptBaseDifficulty);
  }

  /**
   * Check if a concept should be reviewed based on spaced repetition.
   * @param {object} mastery - Mastery record
   * @returns {boolean}
   */
  shouldReview(mastery) {
    if (!mastery || mastery.attempts === 0) return false;
    if (mastery.level >= 4) {
      // Mastered: review after longer intervals
      const daysSince = (Date.now() - mastery.lastSeen) / 86400000;
      return daysSince >= mastery.interval;
    }
    // Not mastered: always eligible for review
    return true;
  }

  /**
   * Get a quality label for display based on accuracy.
   */
  getPerformanceLabel(accuracy) {
    if (accuracy >= 90) return { label: 'Excellent', color: 'var(--color-success)', emoji: '🌟' };
    if (accuracy >= 75) return { label: 'Great', color: 'var(--color-primary)', emoji: '💪' };
    if (accuracy >= 60) return { label: 'Good', color: 'var(--color-accent)', emoji: '👍' };
    if (accuracy >= 40) return { label: 'Keep Going', color: 'var(--color-warning)', emoji: '📈' };
    return { label: 'Needs Practice', color: 'var(--color-error)', emoji: '💡' };
  }
}

export const difficultyAdjuster = new DifficultyAdjuster();
