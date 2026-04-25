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
      <div class="progress-ring" 
           style="width:${size}px;height:${size}px"
           role="progressbar" 
           aria-valuenow="${percentage}" 
           aria-valuemin="0" 
           aria-valuemax="100"
           aria-label="${label || 'Progress'}">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
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
    return `<span class="mastery-badge" 
                  style="--badge-color:${colors[level]}"
                  aria-label="Mastery Level: ${labels[level]}">${labels[level]}</span>`;
  },

  /** Horizontal progress bar */
  progressBar(percentage, height = 6, label = 'Topic progress') {
    return `
      <div class="progress-bar" 
           style="height:${height}px"
           role="progressbar"
           aria-valuenow="${percentage}"
           aria-valuemin="0"
           aria-valuemax="100"
           aria-label="${label}">
        <div class="progress-bar__fill" style="width:${percentage}%"></div>
      </div>`;
  },

  /** Topic card for dashboard/selection */
  topicCard(topic, progress, locked = false) {
    return `
      <div class="topic-card ${locked ? 'topic-card--locked' : ''}" 
           data-topic-id="${topic.id}"
           role="button"
           tabindex="${locked ? '-1' : '0'}"
           aria-disabled="${locked}"
           aria-label="${topic.title}: ${topic.description}. Progress: ${progress.mastered} of ${progress.total} concepts.">
        <div class="topic-card__icon" aria-hidden="true">${topic.icon}</div>
        <div class="topic-card__body">
          <h3 class="topic-card__title">${topic.title}</h3>
          <p class="topic-card__desc">${topic.description}</p>
          ${Components.progressBar(progress.percentage)}
          <div class="topic-card__meta">
            <span>${progress.mastered}/${progress.total} concepts</span>
            ${locked ? '<span class="topic-card__lock" aria-label="Locked">🔒 Complete prerequisites</span>' : ''}
          </div>
        </div>
        ${!locked ? '<button class="btn btn--sm btn--primary topic-card__btn" tabindex="-1">Start</button>' : ''}
      </div>`;
  },

  /** Quiz option button */
  quizOption(text, index, state = 'default') {
    const stateClass = state !== 'default' ? `quiz-option--${state}` : '';
    const letters = ['A', 'B', 'C', 'D'];
    return `<button class="quiz-option ${stateClass}" 
                    data-option-index="${index}"
                    aria-label="Option ${letters[index]}: ${text}">
      <span class="quiz-option__letter" aria-hidden="true">${letters[index]}</span>
      <span class="quiz-option__text">${text}</span>
    </button>`;
  },

  /** Stat card */
  statCard(icon, value, label) {
    return `
      <div class="stat-card" role="group" aria-label="${label}: ${value}">
        <div class="stat-card__icon" aria-hidden="true">${icon}</div>
        <div class="stat-card__value">${value}</div>
        <div class="stat-card__label">${label}</div>
      </div>`;
  },

  /** Strategy tab buttons */
  strategyTabs(strategies, activeKey) {
    return `<div class="strategy-tabs" role="tablist" aria-label="Learning strategies">
      ${strategies.map(s => `
        <button class="strategy-tab ${s.key === activeKey ? 'strategy-tab--active' : ''}"
          role="tab"
          aria-selected="${s.key === activeKey}"
          data-strategy="${s.key}">${s.title}</button>
      `).join('')}
    </div>`;
  },

  /** Session header with concept info */
  sessionHeader(topicTitle, conceptTitle, mastery) {
    return `
      <div class="session-header" role="banner">
        <div class="session-header__breadcrumb" aria-label="Breadcrumb">
          <span class="session-header__topic">${topicTitle}</span>
          <span class="session-header__sep" aria-hidden="true">›</span>
          <span class="session-header__concept" aria-current="page">${conceptTitle}</span>
        </div>
        <div class="session-header__mastery">${Components.masteryBadge(mastery.level)}</div>
      </div>`;
  },

  /** Feedback card after quiz answer */
  feedbackCard(feedback) {
    const cls = feedback.type === 'success' ? 'feedback--success' : 'feedback--error';
    return `
      <div class="feedback-card ${cls}" role="alert">
        <div class="feedback-card__title">${feedback.title}</div>
        <div class="feedback-card__message">${feedback.message}</div>
        ${feedback.detail ? `<div class="feedback-card__detail">${feedback.detail}</div>` : ''}
      </div>`;
  },

  /** Empty state */
  emptyState(icon, title, message) {
    return `
      <div class="empty-state" role="status">
        <div class="empty-state__icon" aria-hidden="true">${icon}</div>
        <h3 class="empty-state__title">${title}</h3>
        <p class="empty-state__message">${message}</p>
      </div>`;
  }
};
