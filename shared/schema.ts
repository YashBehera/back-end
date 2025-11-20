import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Profile Schema
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  height: integer("height").notNull(),
  weight: integer("weight").notNull(),
  fitnessGoal: text("fitness_goal").notNull(),
  fitnessLevel: text("fitness_level").notNull(),
  workoutLocation: text("workout_location").notNull(),
  dietaryPreference: text("dietary_preference").notNull(),
  medicalHistory: text("medical_history"),
  stressLevel: text("stress_level"),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
});

// Schema for generating plans (includes profileId)
export const generatePlanSchema = insertUserProfileSchema.extend({
  profileId: z.string(),
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type GeneratePlanRequest = z.infer<typeof generatePlanSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

// Workout Plan Schema
export const workoutPlans = pgTable("workout_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull(),
  planData: jsonb("plan_data").notNull(),
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({
  id: true,
});

export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;
export type WorkoutPlan = typeof workoutPlans.$inferSelect;

// Diet Plan Schema
export const dietPlans = pgTable("diet_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull(),
  planData: jsonb("plan_data").notNull(),
});

export const insertDietPlanSchema = createInsertSchema(dietPlans).omit({
  id: true,
});

export type InsertDietPlan = z.infer<typeof insertDietPlanSchema>;
export type DietPlan = typeof dietPlans.$inferSelect;

// Generated Images Cache Schema
export const generatedImages = pgTable("generated_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemName: text("item_name").notNull().unique(),
  itemType: text("item_type").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertGeneratedImageSchema = createInsertSchema(generatedImages).omit({
  id: true,
});

export type InsertGeneratedImage = z.infer<typeof insertGeneratedImageSchema>;
export type GeneratedImage = typeof generatedImages.$inferSelect;

// TypeScript Types for Frontend
export interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  muscleGroup: string;
  equipment?: string;
  instructions?: string;
}

export interface WorkoutDay {
  day: string;
  exercises: Exercise[];
}

export interface Meal {
  name: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients?: string[];
  preparation?: string;
}

export interface DietDay {
  day: string;
  meals: Meal[];
}

export interface GeneratedWorkoutPlan {
  weeklyPlan: WorkoutDay[];
  overview: string;
}

export interface GeneratedDietPlan {
  weeklyPlan: DietDay[];
  overview: string;
  totalDailyCalories: number;
}
