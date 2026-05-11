import { useEffect, useMemo, useState } from "react";
import { CourseCard } from "../components/course-card";
import { getAllCourses } from "../courses-service";
import { Spinner } from "../../../shared/components/ui/spinner";

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadCourses = async () => {
      try {
        setLoading(true);
        const response = await getAllCourses(controller.signal);
        const payload = Array.isArray(response.data) ? response.data : [];
        setCourses(payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return courses;
    const value = query.toLowerCase();
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(value) ||
        course.author.toLowerCase().includes(value) ||
        course.ISBN.toLowerCase().includes(value)
    );
  }, [query, courses]);

  return (
    <section className="page">
      <div className="hero glass">
        <p className="eyebrow">Online Book Discovery</p>
        <h1>Find your next favorite book in seconds.</h1>
        <p className="muted">
          Browse a curated catalog of titles, see what others are reading, and share your own
          reviews.
        </p>
      </div>

      <div className="search-row glass">
        <input
          className="input"
          placeholder="Search by book title, author, or ISBN"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {loading && (
        <div className="screen-loader">
          <Spinner />
        </div>
      )}
      {error && <p className="error-text">{error}</p>}

      <div className="course-grid">
        {!loading && filtered.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>
    </section>
  );
}
