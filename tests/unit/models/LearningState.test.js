import { describe, it, expect, beforeEach } from 'vitest';
import { LearningState } from '../../../js/models/LearningState.js';

describe('LearningState', () => {
  let state;

  beforeEach(() => {
    state = new LearningState('user-123');
  });

  it('initializes with default values', () => {
    expect(state.userId).toBe('user-123');
    expect(state.currentPhase).toBe('idle');
    expect(state.sessionAnswers).toEqual([]);
    expect(state.sessionHistory).toEqual([]);
  });

  it('starts a session correctly', () => {
    state.startSession('topic-js');
    expect(state.currentTopicId).toBe('topic-js');
    expect(state.currentPhase).toBe('idle');
    expect(state.sessionStartTime).toBeTypeOf('number');
  });

  it('records answers correctly', () => {
    state.startSession('topic-js');
    state.recordAnswer('concept-1', 0, 1, 1, 2); // selected 1, correct 1
    
    expect(state.sessionAnswers).toHaveLength(1);
    expect(state.sessionAnswers[0].correct).toBe(true);
    expect(state.sessionAnswers[0].difficulty).toBe(2);
  });

  it('calculates session stats accurately', () => {
    state.startSession('topic-js');
    state.recordAnswer('concept-1', 0, 1, 1, 2); // Correct
    state.recordAnswer('concept-1', 1, 0, 2, 2); // Incorrect
    
    const stats = state.getSessionStats();
    expect(stats.total).toBe(2);
    expect(stats.correct).toBe(1);
    expect(stats.incorrect).toBe(1);
    expect(stats.accuracy).toBe(50);
    expect(stats.conceptsCovered).toContain('concept-1');
  });

  it('ends session and updates history', () => {
    state.startSession('topic-js');
    state.recordAnswer('concept-1', 0, 1, 1, 2);
    
    const stats = state.endSession();
    expect(state.sessionHistory).toHaveLength(1);
    expect(state.sessionHistory[0].correct).toBe(1);
    expect(state.currentPhase).toBe('idle');
    expect(state.currentTopicId).toBeNull();
  });

  it('serializes and deserializes from JSON', () => {
    state.startSession('topic-js');
    state.recordAnswer('concept-1', 0, 1, 1, 2);
    
    const json = state.toJSON();
    const restored = LearningState.fromJSON(json);
    
    expect(restored.userId).toBe('user-123');
    expect(restored.currentTopicId).toBe('topic-js');
    expect(restored.sessionAnswers).toHaveLength(1);
  });
});
