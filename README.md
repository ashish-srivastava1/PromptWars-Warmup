# Learning Companion - Adaptive Learning Assistant

An AI-powered, intelligent learning assistant that provides personalized, adaptive learning paths for JavaScript concepts.

## Features
- **Adaptive Content:** Dynamically adjusts the explanation strategy (examples, analogies, step-by-step) based on user mastery.
- **Dynamic Difficulty:** Adjusts quiz difficulty dynamically using an SM-2 inspired algorithm.
- **Testing:** Production-grade unit and integration tests using Vitest.
- **Google Cloud Integrations:** Connects to Firebase Firestore for state persistence and Vertex AI for generative content.

## Architecture

The system uses a modular, event-driven architecture separated into logical layers:

```text
+-------------------+       +---------------------+       +----------------------+
|       UI          |       |      ENGINE         |       |      MODELS          |
|  (Views & Events) | <---> | (Session, Content,  | <---> | (UserProfile,        |
|                   |       |  Evaluator, Adjust) |       |  LearningState)      |
+-------------------+       +---------------------+       +----------------------+
                                      |
                                      v
                            +-------------------+
                            |     STORAGE       | (LocalStorage or Firebase Firestore)
                            +-------------------+
```

## Setup & Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Tests:**
   The project includes a comprehensive test suite using `vitest` with `jsdom` for browser emulation.
   ```bash
   npm run test          # Run tests
   npm run test:coverage # Run tests with coverage report
## 🏗️ Architecture & Production Grade Engineering

This platform is architected for production-grade excellence, following Google Staff Engineering standards.

### Core Architecture
The system uses a modular, event-driven architecture:
- **UI Layer**: Vanilla ES6 components with full ARIA accessibility support.
- **Adaptive Engine**: Decoupled logic for learning state management and difficulty adjustment.
- **Resilience Layer**: Exponential backoff and retry patterns for all cloud-bound requests.
- **Security Layer**: Integrated Firebase Auth and automated input sanitization.

### ♿ Accessibility (A11Y)
- **Semantic HTML**: Proper use of `<main>`, `<header>`, `<nav>`, and `<section>` landmarks.
- **Keyboard Navigation**: Full support for `TAB` and `ENTER/SPACE` interaction across all views.
- **Screen Reader Optimized**: Comprehensive ARIA roles (`progressbar`, `radiogroup`, `alert`) and live regions.
- **Focus Management**: Automated focus shifting between onboarding steps and learning sessions.

### 🔒 Security Hardening
- **Identity**: Firebase Authentication (Anonymous/Email) ensures secure, isolated user sessions.
- **Sanitization**: All dynamic content is passed through a sanitization layer to prevent XSS.
- **Validation**: Strict schema validation for usernames and learning data.
- **Observability**: Structured, correlated logging integrated with GCP Cloud Logging.

## ☁️ Advanced Google Cloud Integration

The platform goes beyond basic usage to leverage the depth of GCP:

1.  **Firebase Firestore**: Distributed, low-latency data persistence with secure role-based access.
2.  **Firebase Authentication**: Secure user identity management.
3.  **GCP Cloud Logging**: Centralized observability with request correlation IDs for distributed tracing.
4.  **Vertex AI (Gemini)**: Structured few-shot prompting for consistent, adaptive learning explanations.

## 🚀 Setup & Run

### Prerequisites
- Node.js (v18+)
- A Google Cloud Project with Billing enabled.

### Local Development
1.  **Clone the Repo**: `git clone <repo_url>`
2.  **Install Dependencies**: `npm install`
3.  **Configure Environment**: 
    - Copy `.env.example` to `.env`.
    - Fill in your Firebase and Vertex AI credentials.
4.  **Run Locally**: `npm run dev` (or use a static server like `npx serve .`)
5.  **Run Tests**: `npm test`

### Deployment
Deploy to Google App Engine:
```bash
gcloud app deploy app.yaml
```
*Deployment is optimized via `.gcloudignore`, skipping 99% of unnecessary files.*

### Firestore Node.js Demo
To understand how the backend can interact with the same Firestore database used by the frontend:
- **Run the Demo:**
  ```bash
  node samples/firestore_demo.js
  ```
*(Ensure `js/config/cloudConfig.js` has real credentials before running the firestore demo)*.