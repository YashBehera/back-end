import type {
  UserProfile,
  InsertUserProfile,
  WorkoutPlan,
  InsertWorkoutPlan,
  DietPlan,
  InsertDietPlan,
  GeneratedImage,
  InsertGeneratedImage,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User Profile
  getUserProfile(id: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(id: string, profile: InsertUserProfile): Promise<UserProfile>;
  upsertUserProfile(id: string | undefined, profile: InsertUserProfile): Promise<UserProfile>;

  // Workout Plan
  getWorkoutPlan(profileId: string): Promise<WorkoutPlan | undefined>;
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;

  // Diet Plan
  getDietPlan(profileId: string): Promise<DietPlan | undefined>;
  createDietPlan(plan: InsertDietPlan): Promise<DietPlan>;

  // Generated Images
  getGeneratedImage(itemName: string): Promise<GeneratedImage | undefined>;
  createGeneratedImage(image: InsertGeneratedImage): Promise<GeneratedImage>;
}

export class MemStorage implements IStorage {
  private userProfiles: Map<string, UserProfile>;
  private workoutPlans: Map<string, WorkoutPlan>;
  private dietPlans: Map<string, DietPlan>;
  private generatedImages: Map<string, GeneratedImage>;

  constructor() {
    this.userProfiles = new Map();
    this.workoutPlans = new Map();
    this.dietPlans = new Map();
    this.generatedImages = new Map();
  }

  async getUserProfile(id: string): Promise<UserProfile | undefined> {
    return this.userProfiles.get(id);
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const profile: UserProfile = { ...insertProfile, id };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async updateUserProfile(id: string, insertProfile: InsertUserProfile): Promise<UserProfile> {
    const profile: UserProfile = { ...insertProfile, id };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async upsertUserProfile(id: string | undefined, insertProfile: InsertUserProfile): Promise<UserProfile> {
    if (id && this.userProfiles.has(id)) {
      return this.updateUserProfile(id, insertProfile);
    }
    return this.createUserProfile(insertProfile);
  }

  async getWorkoutPlan(profileId: string): Promise<WorkoutPlan | undefined> {
    return Array.from(this.workoutPlans.values()).find(
      (plan) => plan.profileId === profileId
    );
  }

  async createWorkoutPlan(insertPlan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    // Check if a plan already exists for this profile
    const existingPlan = await this.getWorkoutPlan(insertPlan.profileId);
    
    if (existingPlan) {
      // Update existing plan
      const updatedPlan: WorkoutPlan = { ...existingPlan, planData: insertPlan.planData };
      this.workoutPlans.set(existingPlan.id, updatedPlan);
      return updatedPlan;
    }
    
    // Create new plan
    const id = randomUUID();
    const plan: WorkoutPlan = { ...insertPlan, id };
    this.workoutPlans.set(id, plan);
    return plan;
  }

  async getDietPlan(profileId: string): Promise<DietPlan | undefined> {
    return Array.from(this.dietPlans.values()).find(
      (plan) => plan.profileId === profileId
    );
  }

  async createDietPlan(insertPlan: InsertDietPlan): Promise<DietPlan> {
    // Check if a plan already exists for this profile
    const existingPlan = await this.getDietPlan(insertPlan.profileId);
    
    if (existingPlan) {
      // Update existing plan
      const updatedPlan: DietPlan = { ...existingPlan, planData: insertPlan.planData };
      this.dietPlans.set(existingPlan.id, updatedPlan);
      return updatedPlan;
    }
    
    // Create new plan
    const id = randomUUID();
    const plan: DietPlan = { ...insertPlan, id };
    this.dietPlans.set(id, plan);
    return plan;
  }

  async getGeneratedImage(itemName: string): Promise<GeneratedImage | undefined> {
    return Array.from(this.generatedImages.values()).find(
      (img) => img.itemName === itemName
    );
  }

  async createGeneratedImage(insertImage: InsertGeneratedImage): Promise<GeneratedImage> {
    const id = randomUUID();
    const image: GeneratedImage = { ...insertImage, id };
    this.generatedImages.set(id, image);
    return image;
  }
}

export const storage = new MemStorage();
