
import { GoogleGenAI, Type } from "@google/genai";

// Ensure the API key is available, otherwise throw an error.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Defines the expected JSON structure for the comic strip story
const comicStripSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A short, catchy title for the 4-panel comic strip. Max 10 words.",
        },
        panels: {
            type: Type.ARRAY,
            description: "An array of exactly 4 panels for the comic strip.",
            items: {
                type: Type.OBJECT,
                properties: {
                    imagePrompt: {
                        type: Type.STRING,
                        description: "A simple visual description for a single comic panel image. Focus on the cat's action and expression."
                    },
                    caption: {
                        type: Type.STRING,
                        description: "A short, witty caption for this panel. Max 15 words."
                    }
                },
                required: ["imagePrompt", "caption"]
            }
        }
    },
    required: ["title", "panels"],
};

export type ComicStripStory = {
    title: string;
    panels: {
        imagePrompt: string;
        caption: string;
    }[];
};

/**
 * Generates a 4-panel comic strip story (title, panel prompts, captions) using a JSON schema.
 * @param theme - A string describing the comic's theme (e.g., "a cat trying to get attention").
 * @returns A promise that resolves to the structured comic strip story.
 */
export async function generateCatComicStripStory(theme: string): Promise<ComicStripStory> {
    const prompt = `Create a funny and simple 4-panel comic strip about a cat. The theme is: "${theme}". 
    The story should have a clear beginning, middle, and end, told across four panels.
    Panel 1: Setup - The cat sees something or has an idea.
    Panel 2: Action/Complication - The cat attempts something, and a small problem occurs.
    Panel 3: Escalation - The situation gets more chaotic or silly.
    Panel 4: Punchline - The funny or unexpected outcome.
    Keep the descriptions and captions very short and simple.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: comicStripSchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        const parsedJson = JSON.parse(jsonText);
        // Basic validation
        if (!parsedJson.title || !Array.isArray(parsedJson.panels) || parsedJson.panels.length !== 4) {
            throw new Error("Invalid comic strip structure received from API. Expected 4 panels.");
        }
        return parsedJson;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonText);
        throw new Error("Could not parse valid JSON for the comic strip.");
    }
}

/**
 * Generates a single cat cartoon image based on a specific prompt.
 * @param visualPrompt - A string describing the scene for one comic panel.
 * @returns A promise that resolves to a base64 encoded data URL of the generated image.
 */
export async function generateCatCartoon(visualPrompt: string): Promise<string> {
    // The main style prompt is now combined with the specific panel description
    const fullPrompt = `A cute, minimalist, hand-drawn doodle of a cat. The scene is: "${visualPrompt}". Simple black ink sketch on a plain white background, whimsical and playful cartoon style.`;

    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: fullPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '1:1',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed, no images returned.");
    }
    
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
}
