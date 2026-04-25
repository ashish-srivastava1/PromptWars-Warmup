/**
 * SessionView — Learning session UI: explanation display, quiz, feedback.
 */
import { Components } from './Components.js';
import { contentEngine } from '../engine/ContentEngine.js';
import { findConcept } from '../data/curriculum.js';

/** Render minimal markdown (bold) in text */
function renderInline(text) {
  return (text || '').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
}

export class SessionView {
  constructor(sessionManager, onExit) {
    this.sm = sessionManager;
    this.onExit = onExit;
    this._setupListeners();
  }

  _setupListeners() {
    this.sm.on('conceptLoaded', (data) => this._renderExplanation(data));
    this.sm.on('strategyChanged', (data) => this._renderExplanation(data));
    this.sm.on('quizStarted', (data) => this._renderQuiz(data));
    this.sm.on('answerSubmitted', (data) => this._renderFeedback(data));
    this.sm.on('sessionSummary', (data) => this._renderSummary(data));
  }

  render() {
    return `
      <div class="view session-view" id="session-view">
        <nav class="session-nav">
          <button class="btn btn--ghost" id="btn-exit-session">← Back</button>
          <div class="session-nav__progress" id="session-progress-bar"></div>
        </nav>
        <div class="session-content" id="session-content">
          <div class="session-loading">
            <div class="spinner"></div>
            <p>Preparing your lesson…</p>
          </div>
        </div>
      </div>`;
  }

  mount() {
    document.getElementById('btn-exit-session')?.addEventListener('click', () => {
      this.sm.endSession();
      this.onExit();
    });
  }

  startTopic(topicId) {
    this.sm.startSession(topicId);
  }

  _renderExplanation({ concept, explanation, strategy, mastery }) {
    const container = document.getElementById('session-content');
    const strategies = contentEngine.getAvailableStrategies(concept);
    const rendered = contentEngine.renderContent(explanation.content);

    container.innerHTML = `
      <div class="session-panel animate-in">
        ${Components.sessionHeader(concept.topicTitle, concept.title, mastery)}
        ${Components.strategyTabs(strategies, strategy)}
        <div class="explanation-content">${rendered}</div>
        <div class="session-actions">
          <button class="btn btn--primary btn--lg" id="btn-start-quiz">
            Test Your Knowledge →
          </button>
        </div>
      </div>`;

    // Strategy tab switching
    container.querySelectorAll('.strategy-tab').forEach(tab => {
      tab.addEventListener('click', () => this.sm.switchStrategy(tab.dataset.strategy));
    });

    document.getElementById('btn-start-quiz')?.addEventListener('click', () => this.sm.startQuiz());
  }

  _renderQuiz({ concept, question, questionIndex }) {
    const container = document.getElementById('session-content');
    const mastery = this.sm.profile.getMastery(concept.id);
    const stats = this.sm.state.getSessionStats();

    container.innerHTML = `
      <div class="session-panel animate-in">
        ${Components.sessionHeader(concept.topicTitle, concept.title, mastery)}
        <div class="quiz-container">
          <div class="quiz-meta">
            <span class="quiz-meta__difficulty">Difficulty: ${'★'.repeat(question.difficulty)}${'☆'.repeat(4 - question.difficulty)}</span>
            <span class="quiz-meta__score">${stats.correct}/${stats.total} correct</span>
          </div>
          <h3 class="quiz-question">${question.question}</h3>
          <div class="quiz-options" id="quiz-options">
            ${question.options.map((opt, i) => Components.quizOption(opt, i)).join('')}
          </div>
        </div>
      </div>`;

    const optionsEl = document.getElementById('quiz-options');
    optionsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.quiz-option');
      if (!btn || btn.classList.contains('quiz-option--disabled')) return;
      const index = parseInt(btn.dataset.optionIndex);
      // Disable all options immediately
      optionsEl.querySelectorAll('.quiz-option').forEach(b => b.classList.add('quiz-option--disabled'));
      // Highlight selected
      btn.classList.add('quiz-option--selected');
      // Submit after brief delay for visual feedback
      setTimeout(() => this.sm.submitAnswer(index), 300);
    });
  }

  _renderFeedback({ grade, feedback, mastery, newDifficulty }) {
    const container = document.getElementById('session-content');
    const concept = findConcept(this.sm.state.currentConceptId);
    const stats = this.sm.state.getSessionStats();

    // Re-render quiz with correct/incorrect highlights, then show feedback
    const question = concept.quiz[this.sm.state.currentQuestionIndex];

    container.innerHTML = `
      <div class="session-panel animate-in">
        ${Components.sessionHeader(concept.topicTitle, concept.title, mastery)}
        <div class="quiz-container">
          <h3 class="quiz-question">${question.question}</h3>
          <div class="quiz-options quiz-options--graded">
            ${question.options.map((opt, i) => {
              const lastAnswer = this.sm.state.sessionAnswers[this.sm.state.sessionAnswers.length - 1];
              let state = 'default';
              if (i === question.correct) state = 'correct';
              else if (lastAnswer && i === lastAnswer.selected && !grade.correct) state = 'incorrect';
              return Components.quizOption(opt, i, state);
            }).join('')}
          </div>
          ${Components.feedbackCard({ ...feedback, message: renderInline(feedback.message) })}
          <div class="session-actions">
            <button class="btn btn--primary btn--lg" id="btn-next">
              Continue →
            </button>
          </div>
        </div>
      </div>`;

    document.getElementById('btn-next')?.addEventListener('click', () => this.sm.next());
  }

  _renderSummary({ stats, performance }) {
    const container = document.getElementById('session-content');
    const durationMin = Math.max(1, Math.round(stats.duration / 60000));

    container.innerHTML = `
      <div class="session-panel summary-panel animate-in">
        <div class="summary-hero">
          <div class="summary-emoji">${performance.emoji}</div>
          <h2 class="summary-title">${performance.label}!</h2>
          <p class="summary-subtitle">Session Complete</p>
        </div>
        <div class="summary-stats">
          ${Components.progressRing(stats.accuracy, 140, 10, 'Accuracy')}
          <div class="summary-details">
            ${Components.statCard('✅', stats.correct, 'Correct')}
            ${Components.statCard('❌', stats.incorrect, 'Incorrect')}
            ${Components.statCard('📚', stats.conceptsCovered.length, 'Concepts')}
            ${Components.statCard('⏱️', durationMin + 'm', 'Duration')}
          </div>
        </div>
        <div class="session-actions">
          <button class="btn btn--primary btn--lg" id="btn-finish">Back to Dashboard</button>
        </div>
      </div>`;

    document.getElementById('btn-finish')?.addEventListener('click', () => {
      this.sm.endSession();
      this.onExit();
    });
  }
}
