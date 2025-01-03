import { NextRequest, NextResponse } from 'next/server';
import { GeminiClient } from 'gemini-api-client'; // Replace with the actual import based on the Gemini API client library

// Initialize the Gemini API client
const geminiClient = new GeminiClient({
    apiKey: process.env.GEMINI_API_KEY, // Ensure your API key is stored securely
});
console.log('Gemini API client initialized');
// Function to transform text using the Gemini API
async function geminiTextToText(input: string): Promise<string> {
    try {
        const requestPayload = {
            contents: [{ text: input }],
        };
        console.log('Request payload:', requestPayload);

        // Make the API call to Gemini's text generation endpoint
        const response = await geminiClient.models.generateContent("gemini-1.5-flash", requestPayload);

        if (response?.data?.candidates?.length > 0) {
            return response.data.candidates[0].content.text || "No response generated.";
        } else {
            throw new Error("No candidates found in Gemini response.");
        }
    } catch (error) {
        console.error('Error during Gemini text transformation:', error);
        throw new Error('Failed to transform text using Gemini API');
    }
}

// POST request handler
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const inputText = body?.inputText;

        if (!inputText) {
            return NextResponse.json({ error: 'Missing inputText in request body' }, { status: 400 });
        }

        const transformedText = await geminiTextToText(inputText);
        return NextResponse.json({ transformedText }, { status: 200 });
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
    }
}

// GET request handler
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const inputText = searchParams.get('inputText');

        if (!inputText) {
            return NextResponse.json({ error: 'Missing inputText parameter' }, { status: 400 });
        }

        const transformedText = await geminiTextToText(inputText);
        return NextResponse.json({ transformedText }, { status: 200 });
    } catch (error) {
        console.error('Error in GET handler:', error);
        return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
    }
}
