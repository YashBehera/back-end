import OpenAI from "openai";

// Using the javascript_openai blueprint
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateWorkoutPlan(userProfile: {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  fitnessGoal: string;
  fitnessLevel: string;
  workoutLocation: string;
}): Promise<any> {
  try {
    const prompt = `You are an expert fitness coach. Generate a personalized 7-day workout plan for the following user:

Name: ${userProfile.name}
Age: ${userProfile.age}
Gender: ${userProfile.gender}
Height: ${userProfile.height}cm
Weight: ${userProfile.weight}kg
Fitness Goal: ${userProfile.fitnessGoal}
Fitness Level: ${userProfile.fitnessLevel}
Workout Location: ${userProfile.workoutLocation}

Please create a comprehensive weekly workout plan with the following structure:
- Provide an overview (2-3 sentences) explaining the plan's approach
- Create 7 daily workout plans
- Each day should have 3-6 exercises
- For each exercise, include: name, sets, reps (or duration), difficulty level (Beginner/Intermediate/Advanced), muscle group targeted, equipment needed, and brief instructions

Respond in JSON format with this exact structure:
{
  "overview": "string",
  "weeklyPlan": [
    {
      "day": "Day 1 - Monday",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": 3,
          "reps": "10-12",
          "duration": "30 seconds" (optional),
          "difficulty": "Beginner/Intermediate/Advanced",
          "muscleGroup": "Chest/Back/Legs/etc",
          "equipment": "Dumbbells/Bodyweight/etc",
          "instructions": "Brief step-by-step instructions"
        }
      ]
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert fitness coach who creates personalized workout plans. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    
    const result = JSON.parse(content);
    
    // Validate the response structure
    if (!result.overview || !result.weeklyPlan || !Array.isArray(result.weeklyPlan)) {
      throw new Error("Invalid workout plan structure received from AI");
    }
    
    return result;
  } catch (error) {
    console.error("Error generating workout plan:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate workout plan: ${error.message}`);
    }
    throw new Error("Failed to generate workout plan");
  }
}

export async function generateDietPlan(userProfile: {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  fitnessGoal: string;
  dietaryPreference: string;
}): Promise<any> {
  try {
    const prompt = `You are an expert nutritionist. Generate a personalized 7-day diet plan for the following user:

Name: ${userProfile.name}
Age: ${userProfile.age}
Gender: ${userProfile.gender}
Height: ${userProfile.height}cm
Weight: ${userProfile.weight}kg
Fitness Goal: ${userProfile.fitnessGoal}
Dietary Preference: ${userProfile.dietaryPreference}

Please create a comprehensive weekly diet plan with the following structure:
- Provide an overview (2-3 sentences) explaining the nutrition approach
- Specify the total daily calorie target
- Create 7 daily meal plans
- Each day should have 4-5 meals (breakfast, lunch, dinner, and 1-2 snacks)
- For each meal, include: name, meal type, calories, protein (g), carbs (g), fats (g), ingredients list, and brief preparation instructions

Respond in JSON format with this exact structure:
{
  "overview": "string",
  "totalDailyCalories": 2000,
  "weeklyPlan": [
    {
      "day": "Day 1 - Monday",
      "meals": [
        {
          "name": "Meal name",
          "mealType": "Breakfast/Lunch/Dinner/Snack",
          "calories": 450,
          "protein": 25,
          "carbs": 50,
          "fats": 15,
          "ingredients": ["ingredient 1", "ingredient 2"],
          "preparation": "Brief preparation steps"
        }
      ]
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert nutritionist who creates personalized diet plans. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    
    const result = JSON.parse(content);
    
    // Validate the response structure
    if (!result.overview || !result.totalDailyCalories || !result.weeklyPlan || !Array.isArray(result.weeklyPlan)) {
      throw new Error("Invalid diet plan structure received from AI");
    }
    
    return result;
  } catch (error) {
    console.error("Error generating diet plan:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate diet plan: ${error.message}`);
    }
    throw new Error("Failed to generate diet plan");
  }
}

export async function generateImage(
  itemName: string,
  itemType: "exercise" | "meal"
): Promise<{ url: string }> {
  try {
    let prompt = "";
    
    if (itemType === "exercise") {
      prompt = `High-quality photorealistic image of a fit athlete performing ${itemName} with perfect form in a clean, modern gym. Full body visible, correct posture, proper biomechanics, natural lighting, realistic muscles, DSLR 50mm lens, sharp details, dynamic angle, cinematic 4K shot, no text, no watermark, hyperrealistic training photoshoot style.`;
    } else {
      prompt = `Beautifully plated, vibrant, healthy ${itemName} with professional food styling. Soft natural lighting, shallow depth of field, restaurant-quality presentation, macro 8K detail, clean background, no text, no people, no cutlery, appetizing and colorful.`;
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL received from DALL-E");
    }
    
    return { url: imageUrl };
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("Failed to generate image");
  }
}
