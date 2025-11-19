import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemType: "exercise" | "meal";
  title: string;
  description?: string;
  metadata?: Record<string, any>;
}

export function ImageModal({
  isOpen,
  onClose,
  itemName,
  itemType,
  title,
  description,
  metadata,
}: ImageModalProps) {
  const { data: imageData, isLoading } = useQuery({
    queryKey: ["/api/generate-image", itemName, itemType],
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl pr-8">{title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <div className="space-y-6">
            {/* Image */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : imageData?.imageUrl ? (
                <img
                  src={imageData.imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  data-testid="img-generated"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <span className="text-6xl font-heading font-bold text-primary/20">
                    {title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Metadata */}
            {metadata && (
              <div className="space-y-4">
                {/* Exercise Metadata */}
                {itemType === "exercise" && (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {metadata.difficulty && (
                        <Badge variant="secondary">{metadata.difficulty}</Badge>
                      )}
                      {metadata.muscleGroup && (
                        <Badge variant="outline">{metadata.muscleGroup}</Badge>
                      )}
                      {metadata.equipment && (
                        <Badge variant="outline">Equipment: {metadata.equipment}</Badge>
                      )}
                    </div>
                    {(metadata.sets || metadata.duration) && (
                      <div className="text-sm">
                        {metadata.sets && metadata.reps && (
                          <p className="font-medium">
                            {metadata.sets} sets × {metadata.reps} reps
                          </p>
                        )}
                        {metadata.duration && (
                          <p className="font-medium">{metadata.duration}</p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Meal Metadata */}
                {itemType === "meal" && (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {metadata.mealType && (
                        <Badge variant="secondary">{metadata.mealType}</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Calories</p>
                        <p className="font-semibold text-lg">{metadata.calories}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Protein</p>
                        <p className="font-semibold text-lg">{metadata.protein}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Carbs</p>
                        <p className="font-semibold text-lg">{metadata.carbs}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Fats</p>
                        <p className="font-semibold text-lg">{metadata.fats}g</p>
                      </div>
                    </div>
                    {metadata.ingredients && metadata.ingredients.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Ingredients</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {metadata.ingredients.map((ingredient: string, i: number) => (
                            <li key={i}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {/* Description */}
                {description && (
                  <div>
                    <h4 className="font-semibold mb-2">
                      {itemType === "exercise" ? "Instructions" : "Preparation"}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
