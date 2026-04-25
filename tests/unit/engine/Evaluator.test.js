import { describe, it, expect } from 'vitest';
import { evaluator } from '../../../js/engine/Evaluator.js';

describe('Evaluator', () => {
  const mockConcept = {
    id: 'js-basics',
    title: 'JS Basics',
    quiz: [
      { difficulty: 1, text: 'Q1', options: ['A', 'B'], correct: 0, explanation: 'Exp 1' },
      { difficulty: 2, text: 'Q2', options: ['C', 'D'], correct: 1, explanation: 'Exp 2' },
      { difficulty: 3, text: 'Q3', options: ['E', 'F'], correct: 0, explanation: 'Exp 3' }
    ]
  };

  it('selects a question matching target difficulty', () => {
    const q = evaluator.selectQuestion(mockConcept, 2, []);
    expect(q.index).toBe(1);
    expect(q.question.difficulty).toBe(2);
  });

  it('avoids previously answered questions', () => {
    const q = evaluator.selectQuestion(mockConcept, 2, [1]);
    // It should pick difficulty 1 or 3, picking the closest (which is 1 or 3, 1 is index 0)
    expect(q.index).not.toBe(1);
  });

  it('grades an answer correctly', () => {
    const q = mockConcept.quiz[1]; // Q2, correct is 1
    
    const correctRes = evaluator.gradeAnswer(q, 1);
    expect(correctRes.correct).toBe(true);
    expect(correctRes.explanation).toBe('Exp 2');

    const wrongRes = evaluator.gradeAnswer(q, 0);
    expect(wrongRes.correct).toBe(false);
  });

  it('generates appropriate feedback', () => {
    const grade = { correct: true, explanation: 'Good job', correctAnswer: 'D' };
    const feedback = evaluator.generateFeedback(grade, 'JS Basics');
    
    expect(feedback.type).toBe('success');
    expect(feedback.detail).toBe('Good job');

    const wrongGrade = { correct: false, explanation: 'Try again', correctAnswer: 'D' };
    const wrongFeedback = evaluator.generateFeedback(wrongGrade, 'JS Basics');
    
    expect(wrongFeedback.type).toBe('error');
    expect(wrongFeedback.message).toContain('D');
  });

  it('calculates overall mastery accurately', () => {
    const masteryMap = {
      'c1': { level: 2 },
      'c2': { level: 4 }
    };
    // c1 = 2/4 = 50%, c2 = 4/4 = 100%. Average = 75%
    const score = evaluator.calculateOverallMastery(masteryMap, ['c1', 'c2']);
    expect(score).toBe(75);
    
    expect(evaluator.calculateOverallMastery({}, [])).toBe(0);
  });
});
