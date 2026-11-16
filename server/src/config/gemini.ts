import { GoogleGenerativeAI } from '@google/generative-ai'

let genAI: GoogleGenerativeAI | null = null

export function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey)
  }

  return genAI
}

export function isGeminiConfigured(): boolean {
  const apiKey = process.env.GEMINI_API_KEY
  return Boolean(apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim().length > 10)
}
