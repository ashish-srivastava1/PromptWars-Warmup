# Learning Companion — Design Document

## Section 1: Product Thinking

### Target Users
- **Self-learners** wanting structured, adaptive paths through technical topics
- **Students** needing personalized pacing and difficulty adjustment
- **Professionals** filling knowledge gaps efficiently

### Key User Journeys
1. **Onboarding** → Skill assessment → Personalized path generation
2. **Learning Session** → Read explanation → Take quiz → Get adaptive feedback → Progress
3. **Progress Review** → Dashboard with mastery levels, weak areas, recommendations

### Core Problems Solved
1. **One-size-fits-all fails** — People learn at different paces; the system adapts difficulty per-concept using SM-2 spaced repetition
2. **Blind spots** — Learners don't know what they don't know; the system tracks weak areas and surfaces them for review
3. **No feedback loop** — Traditional content doesn't adapt; this system adjusts explanation strategy and question difficulty in real-time

---

## Section 2: System Design

### High-Level Architecture
```
┌──────────────────────────────────────────────────┐
│                   Frontend (SPA)                  │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐ │
│  │Onboarding│ │ Learning │ │    Dashboard       │ │
│  │  Flow    │ │ Session  │ │  (Progress/Stats)  │ │
│  └──────────┘ └──────────┘ └───────────────────┘ │
└───────────────────────┬──────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────┐
│              Core Engine (JS Modules)             │
│  ┌────────────┐ ┌─────────────┐ ┌──────────────┐ │
│  │UserProfile │ │ Session     │ │ Adaptive     │ │
│  │  Manager   │ │ Manager     │ │ Content Gen  │ │
│  ├────────────┤ ├─────────────┤ ├──────────────┤ │
│  │Evaluation  │ │Recommender  │ │ Difficulty   │ │
│  │  Module    │ │  Engine     │ │  Adjuster    │ │
│  └────────────┘ └─────────────┘ └──────────────┘ │
└───────────────────────┬──────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────┐
│           Storage Layer (localStorage)            │
│  User Profiles │ Learning State │ Session History │
└──────────────────────────────────────────────────┘
```

### Production Extension Points
| Component | Prototype | Production |
|-----------|-----------|------------|
| Storage | localStorage | PostgreSQL + Redis cache |
| Content | Static curriculum JSON | LLM-generated explanations (GPT-4/Gemini) |
| Auth | None | OAuth2 / Firebase Auth |
| Analytics | In-memory stats | BigQuery + event streaming |
| API | None (client-side) | REST/gRPC microservices |

### AI/LLM Integration Points
- **Adaptive Explanation Generation**: LLM generates personalized explanations based on user's weak areas
- **Dynamic Quiz Generation**: LLM creates novel questions calibrated to user's level
- **Learning Gap Analysis**: LLM analyzes error patterns to identify misconceptions
- **Conversational Tutoring**: Natural-language Q&A for deeper concept exploration

---

## Section 3: Component Breakdown

### 1. User Modeling System (`UserProfile.js`)
- Tracks per-concept mastery with SM-2 ease factors and intervals
- Maintains accuracy, streak, and session history
- Identifies weak areas (mastery ≤ 1) and strengths (mastery ≥ 3)
- Serializable to/from JSON for persistence

### 2. Recommendation Engine (`Recommender.js`)
- **Next concept selection**: Unseen → Weak → Sequential within a topic
- **Spaced repetition**: Uses intervals from DifficultyAdjuster to schedule reviews
- **Prerequisite gating**: Topics unlock only when prerequisite topic concepts reach mastery ≥ 2
- **Topic ordering**: In-progress first, then unlocked & new, then locked

### 3. Feedback Loop (`DifficultyAdjuster.js` + `Evaluator.js`)
- **Difficulty adjustment**: After correct streak of 2+, increase difficulty; after incorrect, decrease
- **SM-2 ease factor**: Dynamically adjusts per-concept based on answer quality
- **Mastery levels**: 0 (Unseen) → 1 (Learning) → 2 (Familiar) → 3 (Proficient) → 4 (Mastered)
- **Contextual feedback**: Different messages for correct/incorrect with detailed explanations

### 4. Adaptive Content Engine (`ContentEngine.js`)
- **Multi-strategy explanations**: Each concept has `example`, `analogy`, and `stepByStep` strategies
- **Strategy rotation**: If user struggles with one strategy, automatically switches to an unseen one
- **Rendering**: Markdown-like content converted to styled HTML with code blocks

### 5. Session Manager (`SessionManager.js`)
- Orchestrates the full session lifecycle: explain → quiz → feedback → next
- Event-driven architecture (`on/emit`) for clean UI decoupling
- Auto-persists state to localStorage after every action
- Manages concept transitions and session summaries

---

## Section 4: Code Implementation

### Project Structure
```
warmup/
├── index.html                    — Entry point
├── css/index.css                 — Design system (dark theme, glassmorphism)
├── js/
│   ├── app.js                    — App controller & routing
│   ├── data/curriculum.js        — 4 topics, 8 concepts, 24 quiz questions
│   ├── storage/StorageManager.js — localStorage abstraction
│   ├── models/
│   │   ├── UserProfile.js        — SM-2 mastery tracking
│   │   └── LearningState.js      — Session state machine
│   ├── engine/
│   │   ├── SessionManager.js     — Session orchestrator
│   │   ├── ContentEngine.js      — Strategy selection & rendering
│   │   ├── DifficultyAdjuster.js — Adaptive difficulty algorithm
│   │   ├── Evaluator.js          — Question selection & grading
│   │   └── Recommender.js        — Next-step recommendation
│   └── ui/
│       ├── Components.js         — Reusable UI (progress rings, cards, badges)
│       ├── OnboardingView.js     — 3-step onboarding flow
│       ├── SessionView.js        — Learning session UI
│       └── DashboardView.js      — Progress dashboard
```

### Key Design Decisions
1. **ES Modules** — Each module has a single responsibility; the same boundaries map to microservices in production
2. **Event-driven session** — SessionManager emits events, Views subscribe → zero coupling between engine and UI
3. **SM-2 algorithm** — Battle-tested spaced repetition (used by Anki) adapted for real-time difficulty adjustment
4. **No build step** — Pure HTML/CSS/JS with ES modules; runs directly in any modern browser

---

## Section 5: Example User Flows

### Flow 1: New User Onboarding
```
1. User opens app → Welcome screen with "Get Started"
2. Enter name → "Ashish"
3. Select skill level → "Intermediate"
4. Profile created with skillLevel=intermediate, saved to localStorage
5. Dashboard loads → Topics shown with prerequisite gating
   - Variables & Data Types: ✅ Unlocked (no prerequisites)
   - Functions: 🔒 Locked (requires Variables mastery)
```

### Flow 2: Learning a Concept
```
1. Click "Start" on "Variables & Data Types"
2. SessionManager selects first unseen concept: "var, let, and const"
3. ContentEngine picks strategy: "example" (first time default)
4. Explanation displayed with 3 strategy tabs (Example / Analogy / Step-by-Step)
5. User clicks "Test Your Knowledge" → Quiz phase begins
6. Evaluator selects question at difficulty=2 (intermediate starting level)
7. User answers → Graded with contextual feedback
8. After 3 questions or mastery ≥ 3, moves to next concept
9. Session summary shown with accuracy ring and stats
```

### Flow 3: Difficulty Adjustment After Incorrect Answers
```
1. User answers Q1 incorrectly at difficulty=2
   → DifficultyAdjuster: difficulty drops to 1, ease factor decreases by 0.2
   → Mastery stays at level 1 (Learning), streak resets to 0
2. User answers Q2 correctly at difficulty=1
   → Streak becomes 1, ease factor slightly increases
3. User answers Q3 correctly at difficulty=1
   → Streak becomes 2 → difficulty increases back to 2
   → Mastery advances to level 2 (Familiar)
4. On return visit, Recommender flags this concept for review
5. ContentEngine switches to "analogy" strategy (since "example" didn't work well)
```

---

## Section 6: Evaluation Strategy

### Measuring Learning Effectiveness

| Metric | How Measured | Target |
|--------|-------------|--------|
| **Concept Mastery Rate** | % of concepts reaching level 3+ | > 70% after 5 sessions |
| **Accuracy Improvement** | Compare first vs. latest attempt accuracy | > 20% improvement |
| **Time to Mastery** | Sessions needed to reach mastery per concept | Decreasing over time |
| **Retention Rate** | Performance on spaced-repetition reviews | > 80% correct on reviews |
| **Engagement** | Session completion rate, streak length | > 85% completion |
| **Strategy Effectiveness** | Which explanation types correlate with faster mastery | Track per strategy |

### How the System Improves Over Time

1. **Per-user adaptation**: SM-2 ease factors tune interval scheduling to each learner's actual retention
2. **Strategy rotation**: If accuracy is low, the system automatically tries alternative explanation styles
3. **Prerequisite enforcement**: Prevents advancing to topics the user isn't ready for
4. **Weak area surfacing**: Dashboard highlights concepts needing review, preventing knowledge decay

### Production Improvements
1. **A/B testing framework**: Test different explanation strategies, quiz formats, difficulty curves
2. **Collaborative filtering**: "Users similar to you mastered X faster with strategy Y"
3. **LLM-powered tutoring**: Natural language follow-up questions when users struggle
4. **Learning analytics pipeline**: Track engagement funnels, identify drop-off points
5. **Forgetting curve modeling**: Predict when a user will forget a concept and proactively schedule review
