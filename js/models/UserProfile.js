/**
 * UserProfile — Tracks user identity, skill level, concept mastery, and learning history.
 * Mastery per concept uses SM-2-inspired ease factors and intervals.
 */
export class UserProfile {
  constructor({ name, skillLevel = 'beginner', id = null } = {}) {
    this.id = id || crypto.randomUUID();
    this.name = name || 'Learner';
    this.skillLevel = skillLevel; // 'beginner' | 'intermediate' | 'advanced'
    this.createdAt = Date.now();
    this.lastActive = Date.now();
    this.conceptMastery = {};   // conceptId -> MasteryRecord
    this.sessionsCompleted = 0;
    this.totalCorrect = 0;
    this.totalAttempted = 0;
    this.streakDays = 0;
    this.lastSessionDate = null;
  }

  /** Initialize or get mastery record for a concept */
  getMastery(conceptId) {
    if (!this.conceptMastery[conceptId]) {
      this.conceptMastery[conceptId] = {
        level: 0,          // 0=unseen, 1=learning, 2=familiar, 3=proficient, 4=mastered
        easeFactor: 2.5,
        interval: 1,
        attempts: 0,
        correct: 0,
        streak: 0,
        lastSeen: null,
        lastScore: null,
        explanationsSeen: [],
        questionsAnswered: []
      };
    }
    return this.conceptMastery[conceptId];
  }

  /** Update mastery after answering a question */
  updateMastery(conceptId, wasCorrect, difficulty) {
    const m = this.getMastery(conceptId);
    m.attempts++;
    m.lastSeen = Date.now();
    this.totalAttempted++;

    if (wasCorrect) {
      m.correct++;
      m.streak++;
      this.totalCorrect++;
      // Quality score 0-5 (SM-2 style): correct = 3-5 based on difficulty match
      const quality = Math.min(5, 3 + Math.floor(difficulty / 2));
      m.easeFactor = Math.max(1.3, m.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
      m.interval = m.streak === 1 ? 1 : m.streak === 2 ? 3 : Math.round(m.interval * m.easeFactor);
    } else {
      m.streak = 0;
      m.easeFactor = Math.max(1.3, m.easeFactor - 0.2);
      m.interval = 1;
    }

    // Update mastery level based on accuracy and attempts
    const accuracy = m.correct / m.attempts;
    if (m.attempts >= 6 && accuracy >= 0.85) m.level = 4;
    else if (m.attempts >= 4 && accuracy >= 0.75) m.level = 3;
    else if (m.attempts >= 2 && accuracy >= 0.6) m.level = 2;
    else if (m.attempts >= 1) m.level = 1;

    m.lastScore = wasCorrect ? 1 : 0;
    this.lastActive = Date.now();
  }

  /** Record that an explanation strategy was seen */
  recordExplanation(conceptId, strategy) {
    const m = this.getMastery(conceptId);
    if (!m.explanationsSeen.includes(strategy)) {
      m.explanationsSeen.push(strategy);
    }
  }

  /** Record that a specific question was answered */
  recordQuestion(conceptId, questionIndex) {
    const m = this.getMastery(conceptId);
    if (!m.questionsAnswered.includes(questionIndex)) {
      m.questionsAnswered.push(questionIndex);
    }
  }

  /** Get weak areas: concepts with mastery level <= 1 and at least 1 attempt */
  getWeakAreas() {
    return Object.entries(this.conceptMastery)
      .filter(([_, m]) => m.level <= 1 && m.attempts > 0)
      .map(([id, m]) => ({ conceptId: id, ...m }));
  }

  /** Get strong areas: concepts with mastery level >= 3 */
  getStrongAreas() {
    return Object.entries(this.conceptMastery)
      .filter(([_, m]) => m.level >= 3)
      .map(([id, m]) => ({ conceptId: id, ...m }));
  }

  /** Overall accuracy percentage */
  get accuracy() {
    return this.totalAttempted > 0 ? Math.round((this.totalCorrect / this.totalAttempted) * 100) : 0;
  }

  /** Update streak tracking */
  updateStreak() {
    const today = new Date().toDateString();
    if (this.lastSessionDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    this.streakDays = this.lastSessionDate === yesterday ? this.streakDays + 1 : 1;
    this.lastSessionDate = today;
  }

  /** Serialize to plain object */
  toJSON() {
    return {
      id: this.id, name: this.name, skillLevel: this.skillLevel,
      createdAt: this.createdAt, lastActive: this.lastActive,
      conceptMastery: this.conceptMastery,
      sessionsCompleted: this.sessionsCompleted,
      totalCorrect: this.totalCorrect, totalAttempted: this.totalAttempted,
      streakDays: this.streakDays, lastSessionDate: this.lastSessionDate
    };
  }

  /** Deserialize from plain object */
  static fromJSON(data) {
    const profile = new UserProfile({ name: data.name, skillLevel: data.skillLevel, id: data.id });
    Object.assign(profile, data);
    return profile;
  }
}
