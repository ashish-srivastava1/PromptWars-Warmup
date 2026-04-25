/**
 * SessionManager — Orchestrates the full learning session lifecycle.
 * Coordinates between ContentEngine, Evaluator, DifficultyAdjuster, and Recommender.
 */
import { findConcept, findTopic } from '../data/curriculum.js';
import { contentEngine } from './ContentEngine.js';
import { evaluator } from './Evaluator.js';
import { difficultyAdjuster } from './DifficultyAdjuster.js';
import { recommender } from './Recommender.js';
import { cloudStorage as storage } from '../storage/CloudStorageManager.js';

export class SessionManager {
  constructor(userProfile, learningState) {
    this.profile = userProfile;
    this.state = learningState;
    this._listeners = {};
  }

  /** Subscribe to session events */
  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
  }

  _emit(event, data) {
    (this._listeners[event] || []).forEach(cb => cb(data));
  }

  /** Start a new learning session for a topic */
  startSession(topicId) {
    this.state.startSession(topicId);
    const topic = findTopic(topicId);
    const nextConcept = recommender.getNextConceptInTopic(this.profile, topicId);

    if (nextConcept) {
      this.navigateToConcept(nextConcept.id);
    }

    this._emit('sessionStarted', { topic, concept: nextConcept });
    this._save();
  }

  /** Navigate to a specific concept's explanation phase */
  navigateToConcept(conceptId) {
    const concept = findConcept(conceptId);
    if (!concept) return;

    const mastery = this.profile.getMastery(conceptId);
    const strategy = contentEngine.selectStrategy(concept, mastery);
    const explanation = contentEngine.getExplanation(concept, strategy);

    // Set difficulty for upcoming quiz
    this.state.currentDifficulty = difficultyAdjuster.getStartingDifficulty(
      this.profile.skillLevel, mastery, concept.difficulty
    );
    this.state.currentExplanationStrategy = strategy;
    this.state.setConceptAndPhase(conceptId, 'explaining');
    this.profile.recordExplanation(conceptId, strategy);

    this._emit('conceptLoaded', { concept, explanation, strategy, mastery });
    this._save();
  }

  /** Switch explanation strategy for the current concept */
  switchStrategy(strategy) {
    const concept = findConcept(this.state.currentConceptId);
    if (!concept) return;

    const explanation = contentEngine.getExplanation(concept, strategy);
    this.state.currentExplanationStrategy = strategy;
    this.profile.recordExplanation(concept.id, strategy);

    this._emit('strategyChanged', { concept, explanation, strategy });
    this._save();
  }

  /** Move from explanation to quiz phase */
  startQuiz() {
    const concept = findConcept(this.state.currentConceptId);
    if (!concept) return;

    const mastery = this.profile.getMastery(concept.id);
    const answeredInSession = this.state.sessionAnswers
      .filter(a => a.conceptId === concept.id)
      .map(a => a.questionIndex);

    const selected = evaluator.selectQuestion(concept, this.state.currentDifficulty, answeredInSession);
    if (!selected) return;

    this.state.currentQuestionIndex = selected.index;
    this.state.setConceptAndPhase(concept.id, 'quizzing');

    this._emit('quizStarted', { concept, question: selected.question, questionIndex: selected.index });
    this._save();
  }

  /** Submit an answer to the current question */
  submitAnswer(selectedOptionIndex) {
    const concept = findConcept(this.state.currentConceptId);
    if (!concept) return;

    const question = concept.quiz[this.state.currentQuestionIndex];
    if (!question) return;

    // Grade the answer
    const grade = evaluator.gradeAnswer(question, selectedOptionIndex);
    const feedback = evaluator.generateFeedback(grade, concept.title);

    // Record in state
    this.state.recordAnswer(
      concept.id, this.state.currentQuestionIndex,
      selectedOptionIndex, question.correct, question.difficulty
    );

    // Update user mastery
    this.profile.updateMastery(concept.id, grade.correct, question.difficulty);
    this.profile.recordQuestion(concept.id, this.state.currentQuestionIndex);

    // Adjust difficulty for next question
    const mastery = this.profile.getMastery(concept.id);
    this.state.currentDifficulty = difficultyAdjuster.calculateNextDifficulty(
      mastery, grade.correct, this.state.currentDifficulty
    );

    this.state.currentPhase = 'feedback';

    this._emit('answerSubmitted', { grade, feedback, mastery, newDifficulty: this.state.currentDifficulty });
    this._save();
  }

  /** Proceed after feedback — go to next question or next concept */
  next() {
    const concept = findConcept(this.state.currentConceptId);
    if (!concept) return;

    const mastery = this.profile.getMastery(concept.id);
    const sessionAnswersForConcept = this.state.sessionAnswers.filter(a => a.conceptId === concept.id);

    // If answered fewer than 3 questions for this concept and not yet mastered, ask more
    if (sessionAnswersForConcept.length < 3 && mastery.level < 3) {
      this.startQuiz();
      return;
    }

    // Move to next concept in topic
    const nextConcept = recommender.getNextConceptInTopic(this.profile, this.state.currentTopicId);

    if (nextConcept && nextConcept.id !== concept.id) {
      this.navigateToConcept(nextConcept.id);
    } else {
      // Topic complete — show summary
      this.showSummary();
    }
  }

  /** Show session summary */
  showSummary() {
    this.state.currentPhase = 'summary';
    const stats = this.state.getSessionStats();
    const performance = difficultyAdjuster.getPerformanceLabel(stats.accuracy);

    this._emit('sessionSummary', { stats, performance });
    this._save();
  }

  /** End the session and persist */
  endSession() {
    this.profile.sessionsCompleted++;
    this.profile.updateStreak();
    const stats = this.state.endSession();

    this._emit('sessionEnded', { stats });
    this._save();
    return stats;
  }

  /** Persist current state */
  _save() {
    storage.save('profile', this.profile.toJSON());
    storage.save('learningState', this.state.toJSON());
  }
}
