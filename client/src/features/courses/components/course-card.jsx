import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";

export function CourseCard({ course }) {
  return (
    <article className="course-card glass">
      <div className="course-card__top">
        <span className="course-tag">#{course.ISBN}</span>
      </div>
      <h3>{course.title}</h3>
      <p>By {course.author}</p>
      <Link
        className="btn btn-primary"
        to={ROUTES.bookDetails.replace(":bookId", course.id)}
      >
        View Book
      </Link>
    </article>
  );
}
