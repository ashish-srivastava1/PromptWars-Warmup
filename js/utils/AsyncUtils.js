/**
 * AsyncUtils — Resilience patterns for production apps.
 */
export const AsyncUtils = {
  /**
   * Exponential backoff retry for async operations.
   */
  async retry(fn, options = {}) {
    const { 
      retries = 3, 
      delay = 1000, 
      factor = 2,
      onRetry = null 
    } = options;

    let lastError;
    let currentDelay = delay;

    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (i < retries - 1) {
          if (onRetry) onRetry(err, i + 1);
          await new Promise(resolve => setTimeout(resolve, currentDelay));
          currentDelay *= factor;
        }
      }
    }
    throw lastError;
  },

  /**
   * Adds a timeout to any promise.
   */
  timeout(promise, ms, operationName = 'Operation') {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${operationName} timed out after ${ms}ms`)), ms);
    });
    return Promise.race([promise, timeoutPromise]);
  }
};
