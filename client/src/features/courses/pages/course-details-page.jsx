import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllCourses } from "../courses-service";
import { getBookReviews, removeBookReview, upsertBookReview } from "../../reviews/reviews-service";
import { ReviewList } from "../../reviews/components/review-list";
import { useAuth } from "../../auth/auth-context";

export default function CourseDetailsPage() {
  const { bookId } = useParams();
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const loadData = async () => {
      try {
        setLoading(true);
        const [courseRes, reviewRes] = await Promise.all([
          getAllCourses(controller.signal),
          getBookReviews(bookId, controller.signal)
        ]);
        setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
        setReviews(Array.isArray(reviewRes.data) ? reviewRes.data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    return () => controller.abort();
  }, [bookId]);

  const course = useMemo(() => courses.find((item) => item.id === bookId), [courses, bookId]);

  const submitReview = async (event) => {
    event.preventDefault();
    try {
      const response = await upsertBookReview(bookId, reviewText);
      if (!response.success) throw new Error(response.message || "Review update failed.");
      const latest = await getBookReviews(bookId);
      setReviews(Array.isArray(latest.data) ? latest.data : []);
      setReviewText("");
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteReview = async () => {
    try {
      await removeBookReview(bookId);
      const latest = await getBookReviews(bookId);
      setReviews(Array.isArray(latest.data) ? latest.data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="screen-loader">Loading...</div>;
  if (!course) return <p className="error-text">Book not found.</p>;

  return (
    <section className="page details-layout">
      <article className="details-card glass">
        <p className="eyebrow">Book Spotlight</p>
        <h1>{course.title}</h1>
        <p className="muted">Author: {course.author}</p>
        <p className="muted">ISBN: {course.ISBN}</p>
      </article>

      <article className="details-card glass">
        <h2>Learner Reviews</h2>
        <ReviewList reviews={reviews} />
        {isAuthenticated && (
          <form className="review-form" onSubmit={submitReview}>
            <textarea
              className="input"
              rows={4}
              placeholder="Share a helpful review..."
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              required
            />
            <div className="inline-actions">
              <button className="btn btn-primary">Submit Review</button>
              <button type="button" className="btn btn-ghost" onClick={deleteReview}>
                Delete My Review
              </button>
            </div>
          </form>
        )}
        {!isAuthenticated && <p className="muted">Sign in to add or edit your review.</p>}
      </article>
      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
