export function ReviewList({ reviews, currentUserId, onDelete }) {
  if (!reviews?.length) {
    return <p className="muted">No reviews yet. Be the first to leave one.</p>;
  }

  return (
    <ul className="review-list">
      {reviews.map((review, index) => {
        const canDelete = currentUserId && review.userId === currentUserId;
        return (
          <li key={review.id || `${review.review_text}-${index}`} className="glass review-item">
            <div className="review-item__header">
              <span className="review-rating">Rating: {review.rating ?? 0}/4</span>
              {canDelete && (
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  onClick={() => onDelete?.(review)}
                >
                  Delete
                </button>
              )}
            </div>
            <p>{review.review_text}</p>
          </li>
        );
      })}
    </ul>
  );
}
