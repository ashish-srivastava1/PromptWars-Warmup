/**
 * ContentEngine — Selects the best explanation strategy for a user/concept pair.
 * Adapts based on what the user has already seen and their performance.
 */
export class ContentEngine {
  /**
   * Select the best explanation strategy for a concept.
   * Strategy: if the user failed with one strategy, try a different one.
   * @param {object} concept - Concept with explanations
   * @param {object} mastery - User's mastery record for this concept
   * @returns {string} Strategy key: 'example' | 'analogy' | 'stepByStep'
   */
  selectStrategy(concept, mastery) {
    const available = Object.keys(concept.explanations || {});
    if (available.length === 0) return 'example';

    const seen = mastery?.explanationsSeen || [];

    // If user has low accuracy and has seen strategies, try an unseen one
    if (mastery && mastery.attempts > 0) {
      const accuracy = mastery.correct / mastery.attempts;
      if (accuracy < 0.6) {
        const unseen = available.filter(s => !seen.includes(s));
        if (unseen.length > 0) return unseen[0];
      }
    }

    // First time: start with 'example', then cycle
    if (seen.length === 0) return available.includes('example') ? 'example' : available[0];

    // If all seen, rotate to least recently used
    const lastSeen = seen[seen.length - 1];
    const lastIndex = available.indexOf(lastSeen);
    return available[(lastIndex + 1) % available.length];
  }

  /**
   * Get the explanation content for a concept + strategy.
   * @returns {{ title: string, content: string, strategy: string }}
   */
  getExplanation(concept, strategy) {
    const expl = concept.explanations?.[strategy];
    if (!expl) {
      // Fallback to first available
      const firstKey = Object.keys(concept.explanations || {})[0];
      const fallback = concept.explanations?.[firstKey];
      return fallback ? { ...fallback, strategy: firstKey } : { title: 'No content', content: '', strategy: '' };
    }
    return { ...expl, strategy };
  }

  /**
   * Get all available strategies for a concept.
   */
  getAvailableStrategies(concept) {
    return Object.entries(concept.explanations || {}).map(([key, val]) => ({
      key, title: val.title
    }));
  }

  /**
   * Render markdown-like content to HTML (simple subset).
   */
  renderContent(text) {
    if (!text) return '';
    return text
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      // Wrap in paragraph
      .replace(/^/, '<p>').replace(/$/, '</p>');
  }
}

export const contentEngine = new ContentEngine();
