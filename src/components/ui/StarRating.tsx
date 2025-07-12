import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showNumber = true,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.floor(rating);
          const isPartial = starValue === Math.ceil(rating) && rating % 1 !== 0;

          return (
            <div key={index} className="relative">
              <Star
                className={cn(
                  sizeClasses[size],
                  "stroke-amber-400",
                  isFilled ? "fill-amber-400" : "fill-gray-200"
                )}
              />
              {isPartial && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${(rating % 1) * 100}%` }}
                >
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "fill-amber-400 stroke-amber-400"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span
          className={cn("font-medium text-gray-700", textSizeClasses[size])}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
