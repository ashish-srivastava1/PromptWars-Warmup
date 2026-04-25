import { describe, it, expect } from 'vitest';
import { SessionManager } from '../../js/engine/SessionManager.js';
import { UserProfile } from '../../js/models/UserProfile.js';
import { LearningState } from '../../js/models/LearningState.js';

// We need to mock localStorage because StorageManager uses it
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};

describe('Integration: Session Flow', () => {
  it('should successfully run a full feedback loop for a session', () => {
    const profile = new UserProfile('test-user');
    const state = new LearningState('test-user');
    
    const manager = new SessionManager(profile, state);
    manager.startSession('variables'); // topic ID must match what is in curriculum.js

    // State should now be set to a concept and explaining phase
    expect(state.currentTopicId).toBe('variables');
    expect(state.currentPhase).toBe('explaining');
    expect(state.currentConceptId).toBeTruthy();
    
    // Simulate moving to quiz phase
    manager.startQuiz();
    expect(state.currentPhase).toBe('quizzing');
    expect(state.currentQuestionIndex).toBeGreaterThanOrEqual(0);

    // Answer the question (index 0)
    manager.submitAnswer(0);
    expect(state.currentPhase).toBe('feedback');
    expect(state.sessionAnswers.length).toBe(1);

    // Click "Next Concept" or "Finish"
    manager.next();
    
    // The session should either be quizzing again, explaining next, or summary
    expect(['quizzing', 'explaining', 'summary']).toContain(state.currentPhase);
    
    // End session
    const stats = manager.endSession();
    expect(stats.total).toBe(1);
    expect(profile.sessionsCompleted).toBe(1);
  });
});
