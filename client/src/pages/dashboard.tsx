import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Dumbbell, Utensils, User, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertUserProfile, GeneratedWorkoutPlan, GeneratedDietPlan } from "@shared/schema";
import { WorkoutPlanView } from "@/components/workout-plan-view";
import { DietPlanView } from "@/components/diet-plan-view";
import { ThemeToggle } from "@/components/theme-toggle";
import { getProfile, getProfileId } from "@/lib/profile-storage";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [userProfile, setUserProfile] = useState<InsertUserProfile | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const profile = getProfile();
    const id = getProfileId();
    
    if (!profile || !id) {
      setLocation("/onboarding");
      return;
    }
    
    setUserProfile(profile);
    setProfileId(id);
  }, [setLocation]);

  const { data: workoutPlan, isLoading: workoutLoading } = useQuery<GeneratedWorkoutPlan>({
    queryKey: ["/api/workout-plan", profileId],
    queryFn: profileId ? async () => {
      const response = await fetch(`/api/workout-plan/${profileId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch workout plan");
      }
      return response.json();
    } : undefined,
    enabled: !!profileId,
  });

  const { data: dietPlan, isLoading: dietLoading } = useQuery<GeneratedDietPlan>({
    queryKey: ["/api/diet-plan", profileId],
    queryFn: profileId ? async () => {
      const response = await fetch(`/api/diet-plan/${profileId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch diet plan");
      }
      return response.json();
    } : undefined,
    enabled: !!profileId,
  });

  const generateWorkoutMutation = useMutation({
    mutationFn: async () => {
      if (!userProfile || !profileId) {
        throw new Error("User profile not found");
      }
      return apiRequest("POST", "/api/generate-workout", { ...userProfile, profileId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-plan", profileId] });
      toast({
        title: "Success!",
        description: "Your personalized workout plan has been generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate workout plan",
        variant: "destructive",
      });
    },
  });

  const generateDietMutation = useMutation({
    mutationFn: async () => {
      if (!userProfile || !profileId) {
        throw new Error("User profile not found");
      }
      return apiRequest("POST", "/api/generate-diet", { ...userProfile, profileId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diet-plan", profileId] });
      toast({
        title: "Success!",
        description: "Your personalized diet plan has been generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate diet plan",
        variant: "destructive",
      });
    },
  });

  if (!userProfile) {
    return null;
  }

  const hasWorkoutPlan = !!workoutPlan;
  const hasDietPlan = !!dietPlan;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl">AI Fitness Coach</h1>
              <p className="text-sm text-muted-foreground">Welcome, {userProfile.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/onboarding")}
              data-testid="button-profile"
            >
              <User className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fitness Goal</p>
                  <p className="font-semibold text-lg" data-testid="text-fitness-goal">{userProfile.fitnessGoal}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fitness Level</p>
                  <p className="font-semibold text-lg" data-testid="text-fitness-level">{userProfile.fitnessLevel}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Diet Preference</p>
                  <p className="font-semibold text-lg" data-testid="text-diet-preference">{userProfile.dietaryPreference}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plans Tabs */}
        <Tabs defaultValue="workout" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="workout" data-testid="tab-workout">
              <Dumbbell className="h-4 w-4 mr-2" />
              Workout Plan
            </TabsTrigger>
            <TabsTrigger value="diet" data-testid="tab-diet">
              <Utensils className="h-4 w-4 mr-2" />
              Diet Plan
            </TabsTrigger>
          </TabsList>

          {/* Workout Plan Tab */}
          <TabsContent value="workout">
            {!hasWorkoutPlan && !workoutLoading && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Generate Your Workout Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Get a personalized workout plan tailored to your fitness goals, level, and preferred workout location.
                  </p>
                  <Button
                    onClick={() => generateWorkoutMutation.mutate()}
                    disabled={generateWorkoutMutation.isPending}
                    data-testid="button-generate-workout"
                  >
                    {generateWorkoutMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Dumbbell className="mr-2 h-4 w-4" />
                        Generate Workout Plan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {workoutLoading && (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            )}

            {hasWorkoutPlan && workoutPlan && (
              <WorkoutPlanView plan={workoutPlan as GeneratedWorkoutPlan} />
            )}
          </TabsContent>

          {/* Diet Plan Tab */}
          <TabsContent value="diet">
            {!hasDietPlan && !dietLoading && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Generate Your Diet Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Get a personalized nutrition plan designed for your dietary preferences and fitness goals.
                  </p>
                  <Button
                    onClick={() => generateDietMutation.mutate()}
                    disabled={generateDietMutation.isPending}
                    data-testid="button-generate-diet"
                  >
                    {generateDietMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Utensils className="mr-2 h-4 w-4" />
                        Generate Diet Plan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {dietLoading && (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <div className="grid md:grid-cols-2 gap-4">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            )}

            {hasDietPlan && dietPlan && (
              <DietPlanView plan={dietPlan as GeneratedDietPlan} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
