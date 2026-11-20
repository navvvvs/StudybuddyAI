// services/gemini.js
// Wraps the @google/genai SDK to generate study content (summary, flashcards, quiz)
// from raw notes text. Returns a plain JS object ready to be saved.

import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

if (!apiKey) {
  console.error('❌  GEMINI_API_KEY is not set in server/.env');
}

// Initialise the SDK client once at module load time.
const ai = new GoogleGenAI({ apiKey });

/**
 * Strips markdown code fences that Gemini sometimes adds around JSON responses,
 * even when instructed not to.
 * @param {string} text - Raw text from Gemini
 * @returns {string} - Cleaned JSON string
 */
function stripCodeFences(text) {
  // Remove ```json ... ``` or ``` ... ``` wrappers
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
}

/**
 * Calls Gemini to generate a summary, 8 flashcards, and a 5-question MCQ quiz
 * from the provided notes text.
 *
 * @param {string} notes - The user's study notes (plain text)
 * @returns {Promise<{ summary: string, flashcards: Array, quiz: Array }>}
 * @throws Will throw an error (to be caught by the route) if Gemini fails or returns bad JSON.
 */
export async function generateStudyContent(notes) {
  const prompt = `You are a helpful study assistant. Analyze the following study notes and generate study materials in VALID JSON only. Do not include any explanation, markdown, or code fences — return raw JSON only.

The JSON must have exactly this structure:
{
  "summary": "<4-6 sentence summary of the notes>",
  "flashcards": [
    { "front": "<term or question>", "back": "<definition or answer>" }
  ],
  "quiz": [
    {
      "question": "<question text>",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "answerIndex": <0-3, index of the correct option>,
      "explanation": "<one sentence explanation of why this is correct>"
    }
  ]
}

Requirements:
- summary: exactly 4-6 sentences, covering the main points
- flashcards: exactly 8 items covering key terms or concepts from the notes
- quiz: exactly 5 multiple-choice questions with exactly 4 options each, testing understanding (not just recall)
- answerIndex must be a number (0, 1, 2, or 3)
- All content must come directly from the provided notes

STUDY NOTES:
${notes}`;

  let responseText;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        // Ask for JSON output — Gemini 2.5 supports this
        responseMimeType: 'application/json',
        temperature: 0.4, // slight creativity but mostly focused
      },
    });

    responseText = response.text;
  } catch (err) {
    console.error('Gemini API call failed:', err?.message || err);
    throw new Error(`Gemini API error: ${err?.message || 'Unknown error'}`);
  }

  // Defensive parse: strip fences and parse JSON
  try {
    const cleaned = stripCodeFences(responseText);
    const parsed = JSON.parse(cleaned);

    // Basic shape validation before returning
    if (!parsed.summary || !Array.isArray(parsed.flashcards) || !Array.isArray(parsed.quiz)) {
      throw new Error('Gemini returned an unexpected JSON shape');
    }
    if (parsed.flashcards.length === 0 || parsed.quiz.length === 0) {
      throw new Error('Gemini returned empty flashcards or quiz');
    }

    return {
      summary: String(parsed.summary),
      flashcards: parsed.flashcards.slice(0, 8), // cap at 8 just in case
      quiz: parsed.quiz.slice(0, 5),             // cap at 5 just in case
    };
  } catch (err) {
    console.error('Failed to parse Gemini response:', responseText);
    throw new Error(`Failed to parse Gemini response: ${err.message}`);
  }
}
