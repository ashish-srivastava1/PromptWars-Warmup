import { describe, it, expect, vi } from 'vitest';
import { SecurityUtils } from '../../js/utils/SecurityUtils.js';
import { AsyncUtils } from '../../js/utils/AsyncUtils.js';
import { Components } from '../../js/ui/Components.js';

describe('Production Grade Utilities', () => {
  describe('SecurityUtils', () => {
    it('should sanitize HTML to prevent XSS by stripping dangerous attributes', () => {
      const dirty = '<img src="valid.jpg" onerror="alert(1)">';
      const clean = SecurityUtils.sanitizeHTML(dirty);
      expect(clean).not.toContain('onerror');
      expect(clean).toContain('<img src="valid.jpg">');
    });

    it('should validate usernames correctly', () => {
      expect(SecurityUtils.validateUsername('ValidName')).toBe(true);
      expect(SecurityUtils.validateUsername('A')).toBe(false); // Too short
      expect(SecurityUtils.validateUsername('NameWithSpecial!@#')).toBe(false);
      expect(SecurityUtils.validateUsername('   ')).toBe(false);
    });
  });

  describe('AsyncUtils', () => {
    it('should retry a failing operation and eventually succeed', async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts < 3) throw new Error('Fail');
        return 'Success';
      };

      const result = await AsyncUtils.retry(fn, { retries: 5, delay: 10 });
      expect(result).toBe('Success');
      expect(attempts).toBe(3);
    });

    it('should throw after max retries', async () => {
      const fn = async () => { throw new Error('Permanent Fail'); };
      await expect(AsyncUtils.retry(fn, { retries: 2, delay: 10 })).rejects.toThrow('Permanent Fail');
    });
  });

  describe('Accessibility Compliance', () => {
    it('progressRing should have appropriate ARIA roles', () => {
      const html = Components.progressRing(50, 100, 5, 'Test Progress');
      expect(html).toContain('role="progressbar"');
      expect(html).toContain('aria-valuenow="50"');
    });

    it('topicCard should be keyboard accessible', () => {
      const topic = { id: 't1', title: 'Test', description: 'Desc', icon: '🚀' };
      const progress = { percentage: 0, mastered: 0, total: 1 };
      const html = Components.topicCard(topic, progress);
      expect(html).toContain('role="button"');
      expect(html).toContain('tabindex="0"');
    });
  });
});
