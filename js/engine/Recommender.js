/**
 * Recommender — Suggests next concepts, review items, and topics based on
 * user profile, mastery, and curriculum prerequisites.
 */
import { getAllConcepts, findTopic, CURRICULUM } from '../data/curriculum.js';
import { difficultyAdjuster } from './DifficultyAdjuster.js';

export class Recommender {
  /**
   * Get the next concept to learn in a topic.
   * Priority: unseen → weak (needs review) → next in sequence.
   */
  getNextConceptInTopic(userProfile, topicId) {
    const topic = findTopic(topicId);
    if (!topic) return null;

    // Find first unseen concept
    for (const concept of topic.concepts) {
      const mastery = userProfile.conceptMastery[concept.id];
      if (!mastery || mastery.attempts === 0) return concept;
    }

    // Find weakest concept that needs review
    const weak = topic.concepts
      .filter(c => {
        const m = userProfile.conceptMastery[c.id];
        return m && m.level < 3 && difficultyAdjuster.shouldReview(m);
      })
      .sort((a, b) => {
        const ma = userProfile.conceptMastery[a.id];
        const mb = userProfile.conceptMastery[b.id];
        return ma.level - mb.level;
      });

    if (weak.length > 0) return weak[0];

    // All concepts proficient — return first for review
    return topic.concepts[0];
  }

  /**
   * Get concepts that need review across all topics (spaced repetition).
   */
  getReviewConcepts(userProfile) {
    const all = getAllConcepts();
    return all.filter(c => {
      const m = userProfile.conceptMastery[c.id];
      return m && m.attempts > 0 && m.level < 4 && difficultyAdjuster.shouldReview(m);
    }).sort((a, b) => {
      const ma = userProfile.conceptMastery[a.id];
      const mb = userProfile.conceptMastery[b.id];
      return ma.level - mb.level;
    });
  }

  /**
   * Get suggested topics based on prerequisites and user progress.
   * Returns topics ordered by: unlocked & in-progress first, then unlocked & new.
   */
  getSuggestedTopics(userProfile) {
    return CURRICULUM.topics.map(topic => {
      const prereqsMet = this._checkPrerequisites(topic, userProfile);
      const progress = this._getTopicProgress(topic, userProfile);
      return { ...topic, prereqsMet, progress };
    }).sort((a, b) => {
      // In-progress first, then new unlocked, then locked
      if (a.prereqsMet !== b.prereqsMet) return b.prereqsMet - a.prereqsMet;
      if (a.progress.started !== b.progress.started) return b.progress.started - a.progress.started;
      return a.progress.percentage - b.progress.percentage; // less complete first
    });
  }

  /**
   * Check if all prerequisites for a topic are met (mastery >= 2 on all prereq topic concepts).
   */
  _checkPrerequisites(topic, userProfile) {
    if (!topic.prerequisites || topic.prerequisites.length === 0) return true;
    return topic.prerequisites.every(prereqTopicId => {
      const prereqTopic = findTopic(prereqTopicId);
      if (!prereqTopic) return true;
      return prereqTopic.concepts.every(c => {
        const m = userProfile.conceptMastery[c.id];
        return m && m.level >= 2;
      });
    });
  }

  /**
   * Get progress info for a topic.
   */
  _getTopicProgress(topic, userProfile) {
    const concepts = topic.concepts;
    const started = concepts.some(c => {
      const m = userProfile.conceptMastery[c.id];
      return m && m.attempts > 0;
    });
    const mastered = concepts.filter(c => {
      const m = userProfile.conceptMastery[c.id];
      return m && m.level >= 3;
    }).length;
    return {
      started,
      total: concepts.length,
      mastered,
      percentage: concepts.length > 0 ? Math.round((mastered / concepts.length) * 100) : 0
    };
  }
}

export const recommender = new Recommender();
