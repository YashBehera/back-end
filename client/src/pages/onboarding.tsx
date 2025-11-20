import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, User, Target, Dumbbell, Utensils, Loader2 } from "lucide-react";
import { insertUserProfileSchema } from "@shared/schema";
import { saveProfile, saveProfileId } from "@/lib/profile-storage";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Fitness Profile", icon: Target },
  { id: 3, title: "Workout Setup", icon: Dumbbell },
  { id: 4, title: "Diet Preferences", icon: Utensils },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const formSchema = insertUserProfileSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 25,
      gender: "",
      height: 170,
      weight: 70,
      fitnessGoal: "",
      fitnessLevel: "",
      workoutLocation: "",
      dietaryPreference: "",
      medicalHistory: "",
      stressLevel: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Save profile locally first
      saveProfile(data);

      // Create profile on backend
      const res = await apiRequest("POST", "/api/profile", data);
      const json = await res.json();

      if (!json || !json.profileId) {
        throw new Error("Invalid response from server: missing profileId");
      }

      // Save the returned profile ID
      saveProfileId(json.profileId);

      // Stop submitting and navigate to dashboard
      setIsSubmitting(false);
      setLocation("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isComplete = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-colors ${isActive
                        ? "bg-primary text-primary-foreground"
                        : isComplete
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "What are your fitness goals?"}
              {currentStep === 3 && "Where do you prefer to work out?"}
              {currentStep === 4 && "What are your dietary preferences?"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="25"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                data-testid="input-age"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-gender">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="170"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                data-testid="input-height"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="70"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                data-testid="input-weight"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Fitness Profile */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fitnessGoal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fitness Goal</FormLabel>
                          <div className="grid grid-cols-1 gap-3">
                            {["Weight Loss", "Muscle Gain", "General Fitness", "Endurance", "Strength"].map((goal) => (
                              <Card
                                key={goal}
                                className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${field.value === goal ? "border-primary border-2" : ""
                                  }`}
                                onClick={() => field.onChange(goal)}
                                data-testid={`card-goal-${goal.toLowerCase().replace(" ", "-")}`}
                              >
                                <CardContent className="p-4">
                                  <span className="font-medium">{goal}</span>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fitnessLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Fitness Level</FormLabel>
                          <div className="grid grid-cols-1 gap-3">
                            {["Beginner", "Intermediate", "Advanced"].map((level) => (
                              <Card
                                key={level}
                                className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${field.value === level ? "border-primary border-2" : ""
                                  }`}
                                onClick={() => field.onChange(level)}
                                data-testid={`card-level-${level.toLowerCase()}`}
                              >
                                <CardContent className="p-4">
                                  <span className="font-medium">{level}</span>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stressLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Daily Stress Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="medicalHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical History / Injuries (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Lower back pain, Asthma" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Workout Setup */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="workoutLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Where do you prefer to work out?</FormLabel>
                          <div className="grid grid-cols-1 gap-3">
                            {["Home", "Gym", "Outdoor", "Mixed"].map((location) => (
                              <Card
                                key={location}
                                className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${field.value === location ? "border-primary border-2" : ""
                                  }`}
                                onClick={() => field.onChange(location)}
                                data-testid={`card-location-${location.toLowerCase()}`}
                              >
                                <CardContent className="p-4">
                                  <span className="font-medium">{location}</span>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 4: Diet Preferences */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="dietaryPreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dietary Preference</FormLabel>
                          <div className="grid grid-cols-1 gap-3">
                            {["Non-Vegetarian", "Vegetarian", "Vegan", "Pescatarian", "Keto", "Paleo"].map((diet) => (
                              <Card
                                key={diet}
                                className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${field.value === diet ? "border-primary border-2" : ""
                                  }`}
                                onClick={() => field.onChange(diet)}
                                data-testid={`card-diet-${diet.toLowerCase()}`}
                              >
                                <CardContent className="p-4">
                                  <span className="font-medium">{diet}</span>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1"
                      data-testid="button-back"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex-1"
                      data-testid="button-next"
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" className="flex-1" disabled={isSubmitting} data-testid="button-submit">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving Profile...
                        </>
                      ) : (
                        "Generate My Plans"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
