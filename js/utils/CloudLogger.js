import { cloudConfig } from '../config/cloudConfig.js';
import { SecurityUtils } from './SecurityUtils.js';

/**
 * CloudLogger — Structured logging for GCP Observability.
 */
export class CloudLogger {
  constructor(component) {
    this.component = component;
  }

  _log(severity, message, payload = {}) {
    const correlationId = payload.correlationId || SecurityUtils.generateCorrelationId();
    const logEntry = {
      severity,
      message,
      component: this.component,
      timestamp: new Date().toISOString(),
      correlationId,
      ...payload
    };

    // 1. Always log to console in a structured format
    const consoleMethod = severity.toLowerCase() === 'error' ? 'error' : 
                         severity.toLowerCase() === 'warning' ? 'warn' : 'log';
    
    console[consoleMethod](JSON.stringify(logEntry));

    // 2. Integration point for GCP Cloud Logging
    if (cloudConfig.enableCloudLogging) {
      // In a real Google production app, we would send this to the Logging API
      // or via a Firebase function / PubSub bridge.
      // Example: fetch('https://logging.googleapis.com/v2/entries:write', { ... });
    }
  }

  info(msg, payload) { this._log('INFO', msg, payload); }
  warn(msg, payload) { this._log('WARNING', msg, payload); }
  error(msg, payload) { this._log('ERROR', msg, payload); }
}

export const logger = new CloudLogger('Global');
