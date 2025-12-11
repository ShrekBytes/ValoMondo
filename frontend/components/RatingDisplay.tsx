interface RatingDisplayProps {
  avgRating: number | string | null | undefined;
  totalRatings: number | string;
  moderatorRating?: number | string | null;
}

export default function RatingDisplay({ avgRating, totalRatings, moderatorRating }: RatingDisplayProps) {
  // Convert to numbers and handle null/undefined
  const avgRatingNum = avgRating ? parseFloat(avgRating.toString()) : 0;
  const totalRatingsNum = totalRatings ? parseInt(totalRatings.toString()) : 0;
  const moderatorRatingNum = moderatorRating ? parseFloat(moderatorRating.toString()) : null;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="text-yellow-500">⯨</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return stars;
  };

  // Don't show anything if there are no ratings
  if (totalRatingsNum === 0 && !moderatorRatingNum) {
    return (
      <div className="text-gray-500 text-sm">
        No ratings yet. Be the first to rate this item!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* User Rating */}
      {totalRatingsNum > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex text-2xl">
            {renderStars(avgRatingNum)}
          </div>
          <div className="text-gray-600">
            <span className="font-semibold text-lg">{avgRatingNum.toFixed(1)}</span>
            <span className="text-sm ml-1">({totalRatingsNum} {totalRatingsNum === 1 ? 'review' : 'reviews'})</span>
          </div>
        </div>
      )}

      {/* Moderator Rating */}
      {moderatorRatingNum && (
        <div className="flex items-center gap-3 pl-4 border-l-4 border-primary-500">
          <span className="text-sm text-gray-600 font-medium">Our Rating:</span>
          <div className="flex text-lg">
            {renderStars(moderatorRatingNum)}
          </div>
          <span className="text-sm text-gray-600">({moderatorRatingNum}/5)</span>
        </div>
      )}
    </div>
  );
}

