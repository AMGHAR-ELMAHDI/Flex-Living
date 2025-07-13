import { NormalizedReview } from "@/types/reviews";
import { StarRating } from "./StarRating";
import {
  formatDate,
  getRelativeTime,
  truncateText,
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import { User, MapPin, Calendar, Eye, EyeOff } from "lucide-react";
import { Badge } from "./Badge";

interface ReviewCardProps {
  review: NormalizedReview;
  showActions?: boolean;
  onApprove?: (reviewId: string) => void;
  onReject?: (reviewId: string) => void;
  onTogglePublic?: (reviewId: string) => void;
  compact?: boolean;
  className?: string;
}

export function ReviewCard({
  review,
  showActions = false,
  onApprove,
  onReject,
  onTogglePublic,
  compact = false,
  className,
}: ReviewCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{review.guestName}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(review.submittedAt)}</span>
              <span>•</span>
              <span>{getRelativeTime(review.submittedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} size="sm" />
          <Badge variant="secondary" className="text-xs">
            {review.source}
          </Badge>
        </div>
      </div>

      {/* Property Info */}
      <div className="flex items-center gap-1 mb-3 text-sm text-gray-600">
        <MapPin className="w-3 h-3" />
        <span>{review.propertyName}</span>
      </div>

      {/* Review Content */}
      <div className="mb-3">
        <p className="text-gray-700 text-sm leading-relaxed">
          {compact ? truncateText(review.comment, 150) : review.comment}
        </p>
      </div>

      {/* Categories */}
      {review.categories.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {review.categories.map((category, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {category.category}: {(category.rating / 2).toFixed(1)}★
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Status Badges */}
      <div className="flex items-center gap-2 mb-3">
        <Badge
          variant={review.isApproved ? "default" : "destructive"}
          className="text-xs"
        >
          {review.isApproved ? "Approved" : "Pending"}
        </Badge>

        <Badge
          variant={review.isPublic ? "default" : "secondary"}
          className="text-xs flex items-center gap-1"
        >
          {review.isPublic ? (
            <>
              <Eye className="w-3 h-3" />
              Public
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3" />
              Private
            </>
          )}
        </Badge>

        <Badge variant="outline" className="text-xs">
          {review.channel}
        </Badge>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          {!review.isApproved && (
            <button
              onClick={() => onApprove?.(review.id)}
              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors"
            >
              Approve
            </button>
          )}

          {review.isApproved && (
            <button
              onClick={() => onReject?.(review.id)}
              className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
            >
              Reject
            </button>
          )}

          <button
            onClick={() => onTogglePublic?.(review.id)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
          >
            {review.isPublic ? "Make Private" : "Make Public"}
          </button>
        </div>
      )}
    </div>
  );
}
