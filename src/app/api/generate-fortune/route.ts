import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const CSV_FILE_PATH = path.join(process.cwd(), 'users.csv');

function logUserToCSV(name: string, gender: string, dob: string) {
  const timestamp = new Date().toISOString();
  const csvLine = `"${timestamp}","${name.replace(/"/g, '""')}","${gender}","${dob}"\n`;

  try {
    if (!fs.existsSync(CSV_FILE_PATH)) {
      fs.writeFileSync(CSV_FILE_PATH, 'Timestamp,Name,Gender,DOB\n');
    }
    fs.appendFileSync(CSV_FILE_PATH, csvLine);
  } catch (error) {
    console.error('Failed to log to CSV:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, dob, gender, language } = await req.json();

    // Log user details to CSV
    logUserToCSV(name, gender, dob);

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemPrompt = `
You are a Grandmaster of Chinese Metaphysics. The current year is 2026, the Year of the Fire Horse (Bing Wu).

Input Data:
Name: ${name}
Gender: ${gender}
DOB: ${dob}

Your Task:
Generate a personalized Fengshui report for 2026.
You must output STRICT VALID JSON. Do not include markdown code blocks.

JSON Structure:
{
  "zodiac": "String (English Zodiac Sign)",
  "zodiac_zh": "String (Chinese Zodiac Sign)",
  "element": "String (Birth Element)",
  "element_zh": "String (Birth Element in Chinese)",
  "kua": "Number",
  "overview": "String (General luck summary in English)",
  "overview_zh": "String (General luck summary in Chinese)",
  "pillars": {
    "career": { 
      "score": Number (1-10), 
      "text": "String (Career prediction in English)", 
      "text_zh": "String (Career prediction in Chinese)" 
    },
    "wealth": { 
      "score": Number (1-10), 
      "text": "String (Wealth prediction in English)", 
      "text_zh": "String (Wealth prediction in Chinese)" 
    },
    "love": { 
      "score": Number (1-10), 
      "text": "String (Love prediction in English)", 
      "text_zh": "String (Love prediction in Chinese)" 
    },
    "health": { 
      "score": Number (1-10), 
      "text": "String (Health prediction in English)", 
      "text_zh": "String (Health prediction in Chinese)" 
    }
  },
  "lucky": {
    "colors": ["String (English)", "String (English)"],
    "colors_zh": ["String (Chinese)", "String (Chinese)"],
    "numbers": ["String", "String"],
    "numbers_zh": ["String", "String"],
    "directions": ["String (English)", "String (English)"],
    "directions_zh": ["String (Chinese)", "String (Chinese)"]
  }
}

Tone: Mystical but practical. Provide specific advice for each pillar.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const response = await result.response;
    const text = response.text();

    // Return parsed JSON directly
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to generate fortune' }, { status: 500 });
  }
}
