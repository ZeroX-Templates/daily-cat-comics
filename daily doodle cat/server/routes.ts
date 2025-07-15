import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateCatComicStripStory, generateCatCartoon } from "./geminiService";
import { getDailyPrompt } from "./prompts";

export async function registerRoutes(app: Express): Promise<Server> {
  // Comic generation endpoint
  app.get("/api/daily-comic", async (req, res) => {
    try {
      // Get today's prompt
      const theme = getDailyPrompt();
      
      // Generate the story structure
      const story = await generateCatComicStripStory(theme);
      
      // Generate images for each panel
      const imagePromises = story.panels.map(panel => generateCatCartoon(panel.imagePrompt));
      const imageUrls = await Promise.all(imagePromises);
      
      // Combine everything into the final comic
      const comic = {
        title: story.title,
        panels: story.panels.map((panel, index) => ({
          imageUrl: imageUrls[index],
          caption: panel.caption,
        })),
      };
      
      res.json(comic);
    } catch (error) {
      console.error("Error generating comic:", error);
      res.status(500).json({ 
        error: "Failed to generate comic",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get current daily prompt (for debugging)
  app.get("/api/daily-prompt", (req, res) => {
    res.json({ prompt: getDailyPrompt() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
