import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ImageModal } from "./image-modal";
import type { GeneratedWorkoutPlan, Exercise } from "@shared/schema";

interface WorkoutPlanViewProps {
  plan: GeneratedWorkoutPlan;
}

export function WorkoutPlanView({ plan }: WorkoutPlanViewProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  return (
    <>
      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Your Personalized Workout Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{plan.overview}</p>
          </CardContent>
        </Card>

        {/* Weekly Plan */}
        <Accordion type="single" collapsible className="space-y-4" defaultValue="day-0">
          {plan.weeklyPlan.map((day, index) => (
            <AccordionItem key={index} value={`day-${index}`} className="border-0">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover-elevate">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">{index + 1}</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-heading font-semibold text-lg">{day.day}</h3>
                      <p className="text-sm text-muted-foreground">{day.exercises.length} exercises</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <Card
                        key={exerciseIndex}
                        className="cursor-pointer hover-elevate active-elevate-2 transition-all"
                        onClick={() => setSelectedExercise(exercise)}
                        data-testid={`card-exercise-${exerciseIndex}`}
                      >
                        <div className="aspect-[4/3] bg-muted rounded-t-lg overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                            <span className="text-4xl font-heading font-bold text-primary/20">
                              {exercise.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2 line-clamp-2">{exercise.name}</h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {exercise.difficulty}
                            </Badge>
                            {exercise.muscleGroup && (
                              <Badge variant="outline" className="text-xs">
                                {exercise.muscleGroup}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            {exercise.sets && exercise.reps && (
                              <p>{exercise.sets} sets × {exercise.reps} reps</p>
                            )}
                            {exercise.duration && <p>{exercise.duration}</p>}
                            {exercise.equipment && (
                              <p className="text-xs">Equipment: {exercise.equipment}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Image Modal */}
      {selectedExercise && (
        <ImageModal
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          itemName={selectedExercise.name}
          itemType="exercise"
          title={selectedExercise.name}
          description={selectedExercise.instructions}
          metadata={{
            difficulty: selectedExercise.difficulty,
            muscleGroup: selectedExercise.muscleGroup,
            sets: selectedExercise.sets,
            reps: selectedExercise.reps,
            duration: selectedExercise.duration,
            equipment: selectedExercise.equipment,
          }}
        />
      )}
    </>
  );
}
