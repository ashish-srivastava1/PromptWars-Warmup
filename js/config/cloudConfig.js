/**
 * Cloud Configuration Layer
 * Centralized config for Google Cloud Services (Firebase, Vertex AI)
 * 
 * NOTE: For production, do NOT commit actual keys here. 
 * Use environment variables or a build step to inject them.
 */

export const cloudConfig = {
  // Firebase Config (Firestore & Storage)
  firebase: {
    apiKey: "AIzaSy_YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
  },
  
  // Flag to easily toggle cloud integrations
  enableCloudStorage: false, // Disabling by default until keys are provided
  enableCloudLogging: false,
};
