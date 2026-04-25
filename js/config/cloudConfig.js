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
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSy_YOUR_API_KEY",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "your-project",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
  },
  
  // Flag to easily toggle cloud integrations
  enableCloudStorage: true,
  enableCloudLogging: true,
};
