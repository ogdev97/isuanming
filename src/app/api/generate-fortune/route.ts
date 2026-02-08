import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const CSV_FILE_PATH = path.join(process.cwd(), 'users.csv');

function logUserToCSV(name: string, gender: string, dob: string, birthTime: string) {
  const timestamp = new Date().toISOString();
  // Safe CSV string handling
  const safeName = name.replace(/"/g, '""');
  const timeStr = birthTime || "Unknown";
  const csvLine = `"${timestamp}","${safeName}","${gender}","${dob}","${timeStr}"\n`;

  try {
    if (!fs.existsSync(CSV_FILE_PATH)) {
      fs.writeFileSync(CSV_FILE_PATH, 'Timestamp,Name,Gender,DOB,BirthTime\n');
    }
    fs.appendFileSync(CSV_FILE_PATH, csvLine);
  } catch (error) {
    console.error('Failed to log to CSV:', error);
  }
}

const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const MAX_REQUESTS_PER_WINDOW = 3; // 1 request per day for local testing

// Simple in-memory rate limiter (Warning: Resets on server restart/redeploy)
const rateLimitMap = new Map<string, number[]>();

function getClientIp(req: NextRequest): string {
  // Check headers for proxy IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  // Check specific headers for Vercel/Cloudflare
  const realIp = req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip');
  if (realIp) {
    return realIp;
  }
  // Fallback (might be empty in dev)
  return '127.0.0.1';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requestTimestamps = rateLimitMap.get(ip) || [];

  // Filter out timestamps older than the window
  const recentRequests = requestTimestamps.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Limit exceeded
  }

  // Update the map
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true; // request allowed
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Daily limit reached. Your IP can only generate three fortune per day.' },
        { status: 429 }
      );
    }

    const { name, dob, birthTime, gender, language } = await req.json();

    // Log user details to CSV
    logUserToCSV(name, gender, dob, birthTime);

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
Time of Birth: ${birthTime || "Not Provided"}

Your Task:
Generate a personalized Fengshui report for 2026.
${birthTime ? "Since Time of Birth is provided, perform a deep BaZi (Eight Characters) analysis considering the Hour Pillar." : "Perform a general analysis based on the Year, Month, and Day pillars."}

You must output STRICT VALID JSON. Do not include markdown code blocks.

JSON Structure:
{
  "zodiac": "String (English Zodiac Sign)",
  "zodiac_zh": "String (Chinese Zodiac Sign)",
  "element": "String (Birth Element, include BaZi details if time provided)",
  "element_zh": "String (Birth Element in Chinese)",
  "kua": "Number",
  "overview": "String (General luck summary in English. Mention BaZi insights if time provided.)",
  "overview_zh": "String (General luck summary in Chinese. Mention BaZi insights if time provided.)",
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
