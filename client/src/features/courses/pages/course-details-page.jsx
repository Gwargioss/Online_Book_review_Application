import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCourses, removeCourse } from "../courses-service";
import { getBookReviews, createBookReview, removeBookReview } from "../../reviews/reviews-service";
import { ReviewList } from "../../reviews/components/review-list";
import { useAuth } from "../../auth/auth-context";

export default function CourseDetailsPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(4);
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
  const canDeleteBook = user?.id && course?.publisherId === user.id;

  const submitReview = async (event) => {
    event.preventDefault();
    try {
      const response = await createBookReview(bookId, reviewText, reviewRating);
      if (!response.success) throw new Error(response.message || "Review update failed.");
      const latest = await getBookReviews(bookId);
      setReviews(Array.isArray(latest.data) ? latest.data : []);
      setReviewText("");
      setReviewRating(4);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteReview = async (review) => {
    if (!review?.id) return;
    try {
      await removeBookReview(bookId, review.id);
      const latest = await getBookReviews(bookId);
      setReviews(Array.isArray(latest.data) ? latest.data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteBook = async () => {
    if (!canDeleteBook) return;
    if (!window.confirm("Delete this book? This action cannot be undone.")) return;
    try {
      const response = await removeCourse(bookId);
      if (!response.success) throw new Error(response.message || "Book delete failed.");
      navigate("/");
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
        {canDeleteBook && (
          <button type="button" className="btn btn-danger btn-sm" onClick={deleteBook}>
            Delete Book
          </button>
        )}
      </article>

      <article className="details-card glass">
        <h2>Learner Reviews</h2>
        <ReviewList reviews={reviews} currentUserId={user?.id} onDelete={deleteReview} />
        {isAuthenticated && (
          <form className="review-form" onSubmit={submitReview}>
            <label className="muted" htmlFor="review-rating">
              Rating (0-4)
            </label>
            <select
              id="review-rating"
              className="input"
              value={reviewRating}
              onChange={(event) => setReviewRating(Number(event.target.value))}
            >
              {[0, 1, 2, 3, 4].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
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
            </div>
          </form>
        )}
        {!isAuthenticated && <p className="muted">Sign in to add or edit your review.</p>}
      </article>
      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
