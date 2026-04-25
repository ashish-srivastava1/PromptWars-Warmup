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
   ```

3. **Start the Application:**
   Serve the application using any static HTTP server (e.g., `npx serve .`).
   Navigate to `http://localhost:3000` to interact with the learning companion.

## Google Cloud Services Integration

This project is integrated with real Google Cloud services. 

### 1. Firebase (Firestore & Storage)
The application can automatically sync user progress and learning state to a Firestore database. 
- **Configuration:** Update the API keys and project IDs in `js/config/cloudConfig.js`. 
- **Graceful Fallback:** If Firebase configuration is missing or initialization fails, the app seamlessly falls back to `localStorage`.

### 2. Vertex AI (Generative Content)
The project demonstrates how to generate dynamic explanations using Google's Vertex AI / Gemini.
- **Sample Script:** A Node.js sample execution script is provided in `samples/vertex_demo.js`.
- **Run the Demo:** 
  ```bash
  export GEMINI_API_KEY="your-api-key"
  node samples/vertex_demo.js
  ```

### 3. Firestore Node.js Demo
To understand how the backend can interact with the same Firestore database used by the frontend:
- **Run the Demo:**
  ```bash
  node samples/firestore_demo.js
  ```
*(Ensure `js/config/cloudConfig.js` has real credentials before running the firestore demo)*.