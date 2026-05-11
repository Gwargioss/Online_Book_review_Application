export function ReviewList({ reviews }) {
  if (!reviews?.length) {
    return <p className="muted">No reviews yet. Be the first to leave one.</p>;
  }

  return (
    <ul className="review-list">
      {reviews.map((review, index) => (
        <li key={`${review.review_text}-${index}`} className="glass review-item">
          {review.review_text}
        </li>
      ))}
    </ul>
  );
}
