/**
 * SecurityUtils — Production-grade sanitization and validation.
 */
export const SecurityUtils = {
  /**
   * Basic HTML sanitization for AI-generated content.
   * In a real production app, use DOMPurify library.
   */
  sanitizeHTML(html) {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Stripping dangerous attributes and tags
    const dangerousTags = ['script', 'iframe', 'object', 'embed'];
    dangerousTags.forEach(tag => {
      const elements = temp.querySelectorAll(tag);
      elements.forEach(el => el.remove());
    });

    const allElements = temp.querySelectorAll('*');
    allElements.forEach(el => {
      const attrs = el.attributes;
      for (let i = attrs.length - 1; i >= 0; i--) {
        const attrName = attrs[i].name.toLowerCase();
        if (attrName.startsWith('on') || attrName === 'style') {
          el.removeAttribute(attrs[i].name);
        }
      }
    });

    return temp.innerHTML;
  },

  /**
   * Validates a username for length and characters.
   */
  validateUsername(name) {
    if (!name || typeof name !== 'string') return false;
    const trimmed = name.trim();
    // 2-30 chars, alphanumeric + spaces
    return trimmed.length >= 2 && trimmed.length <= 30 && /^[a-zA-Z0-9 ]+$/.test(trimmed);
  },

  /**
   * Generates a request correlation ID for tracing.
   */
  generateCorrelationId() {
    return `req-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
  }
};
