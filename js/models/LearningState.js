/**
 * LearningState — Tracks the active session state: current topic, concept,
 * answers within the session, and session history.
 */
export class LearningState {
  constructor(userId) {
    this.userId = userId;
    this.currentTopicId = null;
    this.currentConceptId = null;
    this.currentDifficulty = 1;
    this.currentPhase = 'idle'; // 'idle' | 'explaining' | 'quizzing' | 'feedback' | 'summary'
    this.currentExplanationStrategy = 'example';
    this.currentQuestionIndex = 0;
    this.sessionAnswers = [];    // { conceptId, questionIndex, selected, correct, difficulty }
    this.sessionStartTime = null;
    this.sessionHistory = [];    // past session summaries
  }

  startSession(topicId) {
    this.currentTopicId = topicId;
    this.currentConceptId = null;
    this.currentPhase = 'idle';
    this.sessionAnswers = [];
    this.sessionStartTime = Date.now();
    this.currentQuestionIndex = 0;
  }

  setConceptAndPhase(conceptId, phase = 'explaining') {
    this.currentConceptId = conceptId;
    this.currentPhase = phase;
  }

  recordAnswer(conceptId, questionIndex, selected, correctIndex, difficulty) {
    this.sessionAnswers.push({
      conceptId, questionIndex, selected,
      correct: selected === correctIndex,
      difficulty, timestamp: Date.now()
    });
  }

  getSessionStats() {
    const answers = this.sessionAnswers;
    const correct = answers.filter(a => a.correct).length;
    return {
      total: answers.length,
      correct,
      incorrect: answers.length - correct,
      accuracy: answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0,
      duration: this.sessionStartTime ? Date.now() - this.sessionStartTime : 0,
      conceptsCovered: [...new Set(answers.map(a => a.conceptId))]
    };
  }

  endSession() {
    const stats = this.getSessionStats();
    this.sessionHistory.push({ ...stats, date: Date.now(), topicId: this.currentTopicId });
    this.currentPhase = 'idle';
    this.currentTopicId = null;
    this.currentConceptId = null;
    this.sessionAnswers = [];
    this.sessionStartTime = null;
    return stats;
  }

  toJSON() {
    return {
      userId: this.userId, currentTopicId: this.currentTopicId,
      currentConceptId: this.currentConceptId, currentDifficulty: this.currentDifficulty,
      currentPhase: this.currentPhase, currentExplanationStrategy: this.currentExplanationStrategy,
      currentQuestionIndex: this.currentQuestionIndex, sessionAnswers: this.sessionAnswers,
      sessionStartTime: this.sessionStartTime, sessionHistory: this.sessionHistory
    };
  }

  static fromJSON(data) {
    const state = new LearningState(data.userId);
    Object.assign(state, data);
    return state;
  }
}
