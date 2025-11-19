import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ImageModal } from "./image-modal";
import type { GeneratedDietPlan, Meal } from "@shared/schema";

interface DietPlanViewProps {
  plan: GeneratedDietPlan;
}

export function DietPlanView({ plan }: DietPlanViewProps) {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case "Breakfast":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
      case "Lunch":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "Dinner":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "Snack":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Your Personalized Diet Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground leading-relaxed">{plan.overview}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                Target: {plan.totalDailyCalories} calories/day
              </Badge>
            </div>
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
                      <p className="text-sm text-muted-foreground">{day.meals.length} meals</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    {day.meals.map((meal, mealIndex) => (
                      <Card
                        key={mealIndex}
                        className="cursor-pointer hover-elevate active-elevate-2 transition-all"
                        onClick={() => setSelectedMeal(meal)}
                        data-testid={`card-meal-${mealIndex}`}
                      >
                        <div className="aspect-[16/9] bg-muted rounded-t-lg overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                            <span className="text-4xl font-heading font-bold text-primary/20">
                              {meal.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold line-clamp-2 flex-1">{meal.name}</h4>
                            <Badge className={getMealTypeColor(meal.mealType)}>
                              {meal.mealType}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-sm">
                            <div className="text-center">
                              <p className="text-muted-foreground text-xs">Calories</p>
                              <p className="font-semibold">{meal.calories}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground text-xs">Protein</p>
                              <p className="font-semibold">{meal.protein}g</p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground text-xs">Carbs</p>
                              <p className="font-semibold">{meal.carbs}g</p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground text-xs">Fats</p>
                              <p className="font-semibold">{meal.fats}g</p>
                            </div>
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
      {selectedMeal && (
        <ImageModal
          isOpen={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          itemName={selectedMeal.name}
          itemType="meal"
          title={selectedMeal.name}
          description={selectedMeal.preparation}
          metadata={{
            mealType: selectedMeal.mealType,
            calories: selectedMeal.calories,
            protein: selectedMeal.protein,
            carbs: selectedMeal.carbs,
            fats: selectedMeal.fats,
            ingredients: selectedMeal.ingredients,
          }}
        />
      )}
    </>
  );
}
