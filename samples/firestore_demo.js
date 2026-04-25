import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import { cloudConfig } from '../js/config/cloudConfig.js';

// Load environment variables
dotenv.config();

/**
 * Sample execution script demonstrating server-side/Node.js usage of Firestore 
 * to fetch or update a user's learning state.
 * 
 * Note: Since we use the web SDK for simplicity in the demo, it works here too,
 * but for a real backend, you would use firebase-admin.
 * 
 * Run with: node samples/firestore_demo.js
 */

async function runDemo() {
  console.log('Initializing Firebase...');
  
  if (cloudConfig.firebase.apiKey === 'AIzaSy_YOUR_API_KEY') {
    console.warn('⚠️ Firebase API key is not configured in js/config/cloudConfig.js.');
    console.warn('⚠️ This script will fail unless you provide a real configuration.');
    process.exit(1);
  }

  const app = initializeApp(cloudConfig.firebase);
  const db = getFirestore(app);

  const userId = 'demo-user-123';
  const docRef = doc(db, 'users', userId, 'data', 'profile');

  const mockProfile = {
    userId,
    name: 'Test Student',
    sessionsCompleted: 5,
    lastActive: Date.now()
  };

  try {
    console.log(`\n1. Saving profile for user: ${userId}...`);
    await setDoc(docRef, mockProfile);
    console.log('✅ Profile saved successfully.');

    console.log(`\n2. Fetching profile from Firestore...`);
    const snap = await getDoc(docRef);
    
    if (snap.exists()) {
      console.log('✅ Profile loaded:');
      console.log(JSON.stringify(snap.data(), null, 2));
    } else {
      console.log('❌ Document does not exist.');
    }

  } catch (err) {
    console.error('❌ Firestore Error:', err.message);
  }
}

runDemo();
