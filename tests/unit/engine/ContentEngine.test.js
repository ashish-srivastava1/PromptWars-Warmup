import { describe, it, expect } from 'vitest';
import { contentEngine } from '../../../js/engine/ContentEngine.js';

describe('ContentEngine', () => {
  const mockConcept = {
    explanations: {
      example: { title: 'By Example', content: 'Here is an example...' },
      analogy: { title: 'By Analogy', content: 'Think of it like a...' },
      stepByStep: { title: 'Step-by-Step', content: 'Step 1...' }
    }
  };

  it('selects example strategy by default for first time', () => {
    const strategy = contentEngine.selectStrategy(mockConcept, null);
    expect(strategy).toBe('example');
  });

  it('cycles strategies if accuracy is low', () => {
    const mastery = { attempts: 2, correct: 0, explanationsSeen: ['example'] };
    const strategy = contentEngine.selectStrategy(mockConcept, mastery);
    expect(strategy).not.toBe('example');
    expect(['analogy', 'stepByStep']).toContain(strategy);
  });

  it('rotates to next available if accuracy is ok but user returns', () => {
    const mastery = { attempts: 2, correct: 2, explanationsSeen: ['example'] };
    const strategy = contentEngine.selectStrategy(mockConcept, mastery);
    expect(strategy).toBe('analogy'); // next after example
  });

  it('retrieves the correct explanation object', () => {
    const expl = contentEngine.getExplanation(mockConcept, 'analogy');
    expect(expl.strategy).toBe('analogy');
    expect(expl.content).toContain('Think of it');
  });

  it('renders markdown to simple HTML', () => {
    const html = contentEngine.renderContent('**bold** and *italic*\n\n`code`');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
    expect(html).toContain('<code>code</code>');
    expect(html).toContain('</p><p>');
  });
});
