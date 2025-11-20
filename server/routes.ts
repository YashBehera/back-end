import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateWorkoutPlan, generateDietPlan, generateImage , generateMotivation } from "./openai";
import { insertUserProfileSchema, generatePlanSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create User Profile
  app.post("/api/profile", async (req, res) => {
    try {
      const validatedData = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createUserProfile(validatedData);
      
      res.json({ profileId: profile.id });
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(400).json({ error: "Invalid profile data" });
    }
  });

  // Generate Workout Plan
  app.post("/api/generate-workout", async (req, res) => {
    try {
      const validatedData = generatePlanSchema.parse(req.body);
      const { profileId, ...profileData } = validatedData;
      
      // Update profile in storage
      await storage.updateUserProfile(profileId, profileData);
      
      // Generate workout plan using OpenAI
      const workoutPlanData = await generateWorkoutPlan(profileData);
      
      // Store the workout plan
      await storage.createWorkoutPlan({
        profileId,
        planData: workoutPlanData,
      });
      
      res.json(workoutPlanData);
    } catch (error) {
      console.error("Error generating workout plan:", error);
      const message = error instanceof Error ? error.message : "Failed to generate workout plan";
      res.status(500).json({ error: message });
    }
  });

  // Generate Diet Plan
  app.post("/api/generate-diet", async (req, res) => {
    try {
      const validatedData = generatePlanSchema.parse(req.body);
      const { profileId, ...profileData } = validatedData;
      
      // Update profile in storage
      await storage.updateUserProfile(profileId, profileData);
      
      // Generate diet plan using OpenAI
      const dietPlanData = await generateDietPlan(profileData);
      
      // Store the diet plan
      await storage.createDietPlan({
        profileId,
        planData: dietPlanData,
      });
      
      res.json(dietPlanData);
    } catch (error) {
      console.error("Error generating diet plan:", error);
      const message = error instanceof Error ? error.message : "Failed to generate diet plan";
      res.status(500).json({ error: message });
    }
  });

  // Get Workout Plan
  app.get("/api/workout-plan/:profileId", async (req, res) => {
    try {
      const { profileId } = req.params;
      
      if (!profileId) {
        return res.status(400).json({ error: "Profile ID is required" });
      }
      
      const plan = await storage.getWorkoutPlan(profileId);
      
      if (!plan) {
        return res.status(404).json({ error: "Workout plan not found" });
      }
      
      res.json(plan.planData);
    } catch (error) {
      console.error("Error fetching workout plan:", error);
      res.status(500).json({ error: "Failed to fetch workout plan" });
    }
  });

  // Get Diet Plan
  app.get("/api/diet-plan/:profileId", async (req, res) => {
    try {
      const { profileId } = req.params;
      
      if (!profileId) {
        return res.status(400).json({ error: "Profile ID is required" });
      }
      
      const plan = await storage.getDietPlan(profileId);
      
      if (!plan) {
        return res.status(404).json({ error: "Diet plan not found" });
      }
      
      res.json(plan.planData);
    } catch (error) {
      console.error("Error fetching diet plan:", error);
      res.status(500).json({ error: "Failed to fetch diet plan" });
    }
  });

  // Generate Image (with caching)
  app.get("/api/generate-image", async (req, res) => {
    try {
      const { itemName, itemType } = req.query;
      
      if (!itemName || !itemType) {
        return res.status(400).json({ error: "itemName and itemType are required" });
      }

      const name = itemName as string;
      const type = itemType as "exercise" | "meal";
      
      // Check if image already exists in cache
      const cachedImage = await storage.getGeneratedImage(name);
      if (cachedImage) {
        return res.json({ imageUrl: cachedImage.imageUrl });
      }
      
      // Generate new image using OpenAI DALL-E
      const { url } = await generateImage(name, type);
      
      // Cache the generated image
      await storage.createGeneratedImage({
        itemName: name,
        itemType: type,
        imageUrl: url,
      });
      
      res.json({ imageUrl: url });
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  // Generate Motivation Quote
  app.post("/api/motivation", async (req, res) => {
    try {
      const { name, fitnessGoal } = req.body;
      
      if (!name || !fitnessGoal) {
        return res.status(400).json({ error: "Name and fitness goal are required" });
      }
      
      // Import this function at the top of server/routes.ts first:
      // import { generateWorkoutPlan, generateDietPlan, generateImage, generateMotivation } from "./openai";
      const quoteData = await generateMotivation(name, fitnessGoal);
      
      res.json(quoteData);
    } catch (error) {
      console.error("Error generating motivation:", error);
      const message = error instanceof Error ? error.message : "Failed to generate motivation";
      res.status(500).json({ error: message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
