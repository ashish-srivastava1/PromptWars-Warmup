import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables (e.g., GEMINI_API_KEY)
dotenv.config();

/**
 * Sample execution script demonstrating how to use Vertex AI / Gemini 
 * to generate dynamic explanation content.
 * 
 * Pre-requisites:
 * 1. npm install @google/genai dotenv
 * 2. Export GEMINI_API_KEY in your environment or .env file
 * 
 * Run with: node samples/vertex_demo.js
 */

async function generateExplanation() {
  console.log('Initializing Google Gen AI Client...');
  
  // Requires GEMINI_API_KEY to be set
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY is missing in environment variables.');
    console.warn('⚠️ To run this demo, please set it: export GEMINI_API_KEY="your-key"');
    process.exit(1);
  }

  const ai = new GoogleGenAI({});

  const concept = 'Closures in JavaScript';
  const userMasteryLevel = 'beginner';
  
  const prompt = `
    You are an expert programming tutor. Explain the concept of "${concept}" to a student 
    who is a ${userMasteryLevel}. 
    
    Format the response as JSON with the following structure:
    {
      "title": "A catchy title",
      "strategy": "analogy",
      "content": "The explanation text..."
    }
    
    Make it engaging and use a real-world analogy.
  `;

  console.log(`\nGenerating explanation for "${concept}"...`);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text);
    console.log('\n✅ Successfully generated explanation:\n');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ Failed to generate content:', error.message);
  }
}

generateExplanation();
