/**
 * Components — Reusable UI building blocks.
 */
export const Components = {
  /** Progress ring SVG */
  progressRing(percentage, size = 120, strokeWidth = 8, label = '') {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return `
      <div class="progress-ring" style="width:${size}px;height:${size}px">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle class="progress-ring__bg" cx="${size/2}" cy="${size/2}" r="${radius}"
            stroke-width="${strokeWidth}" fill="none"/>
          <circle class="progress-ring__fill" cx="${size/2}" cy="${size/2}" r="${radius}"
            stroke-width="${strokeWidth}" fill="none"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
            transform="rotate(-90 ${size/2} ${size/2})"/>
        </svg>
        <div class="progress-ring__label">
          <span class="progress-ring__value">${percentage}%</span>
          ${label ? `<span class="progress-ring__text">${label}</span>` : ''}
        </div>
      </div>`;
  },

  /** Mastery level badge */
  masteryBadge(level) {
    const labels = ['Unseen', 'Learning', 'Familiar', 'Proficient', 'Mastered'];
    const colors = ['var(--color-muted)', 'var(--color-warning)', 'var(--color-accent)', 'var(--color-primary)', 'var(--color-success)'];
    return `<span class="mastery-badge" style="--badge-color:${colors[level]}">${labels[level]}</span>`;
  },

  /** Horizontal progress bar */
  progressBar(percentage, height = 6) {
    return `
      <div class="progress-bar" style="height:${height}px">
        <div class="progress-bar__fill" style="width:${percentage}%"></div>
      </div>`;
  },

  /** Topic card for dashboard/selection */
  topicCard(topic, progress, locked = false) {
    return `
      <div class="topic-card ${locked ? 'topic-card--locked' : ''}" data-topic-id="${topic.id}">
        <div class="topic-card__icon">${topic.icon}</div>
        <div class="topic-card__body">
          <h3 class="topic-card__title">${topic.title}</h3>
          <p class="topic-card__desc">${topic.description}</p>
          ${Components.progressBar(progress.percentage)}
          <div class="topic-card__meta">
            <span>${progress.mastered}/${progress.total} concepts</span>
            ${locked ? '<span class="topic-card__lock">🔒 Complete prerequisites</span>' : ''}
          </div>
        </div>
        ${!locked ? '<button class="btn btn--sm btn--primary topic-card__btn">Start</button>' : ''}
      </div>`;
  },

  /** Quiz option button */
  quizOption(text, index, state = 'default') {
    const stateClass = state !== 'default' ? `quiz-option--${state}` : '';
    return `<button class="quiz-option ${stateClass}" data-option-index="${index}">
      <span class="quiz-option__letter">${String.fromCharCode(65 + index)}</span>
      <span class="quiz-option__text">${text}</span>
    </button>`;
  },

  /** Stat card */
  statCard(icon, value, label) {
    return `
      <div class="stat-card">
        <div class="stat-card__icon">${icon}</div>
        <div class="stat-card__value">${value}</div>
        <div class="stat-card__label">${label}</div>
      </div>`;
  },

  /** Strategy tab buttons */
  strategyTabs(strategies, activeKey) {
    return `<div class="strategy-tabs">
      ${strategies.map(s => `
        <button class="strategy-tab ${s.key === activeKey ? 'strategy-tab--active' : ''}"
          data-strategy="${s.key}">${s.title}</button>
      `).join('')}
    </div>`;
  },

  /** Session header with concept info */
  sessionHeader(topicTitle, conceptTitle, mastery) {
    return `
      <div class="session-header">
        <div class="session-header__breadcrumb">
          <span class="session-header__topic">${topicTitle}</span>
          <span class="session-header__sep">›</span>
          <span class="session-header__concept">${conceptTitle}</span>
        </div>
        <div class="session-header__mastery">${Components.masteryBadge(mastery.level)}</div>
      </div>`;
  },

  /** Feedback card after quiz answer */
  feedbackCard(feedback) {
    const cls = feedback.type === 'success' ? 'feedback--success' : 'feedback--error';
    return `
      <div class="feedback-card ${cls}">
        <div class="feedback-card__title">${feedback.title}</div>
        <div class="feedback-card__message">${feedback.message}</div>
        ${feedback.detail ? `<div class="feedback-card__detail">${feedback.detail}</div>` : ''}
      </div>`;
  },

  /** Empty state */
  emptyState(icon, title, message) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">${icon}</div>
        <h3 class="empty-state__title">${title}</h3>
        <p class="empty-state__message">${message}</p>
      </div>`;
  }
};
