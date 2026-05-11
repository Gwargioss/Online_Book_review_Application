import { Link } from "react-router-dom";
import { useAuth } from "../../auth/auth-context";
import { ROUTES } from "../../../shared/constants/routes";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="page">
      <article className="details-card glass">
        <p className="eyebrow">Dashboard</p>
        <h1>Welcome, {user?.name || user?.username || "Reader"}</h1>
        <p className="muted">
          This page gives authenticated users quick actions to manage profile details and publish
          books.
        </p>
        <div className="inline-actions">
          <Link className="btn btn-primary" to={ROUTES.profile}>
            Edit Profile
          </Link>
          <Link className="btn btn-ghost" to={ROUTES.instructorStudio}>
            Publish Book
          </Link>
        </div>
      </article>
    </section>
  );
}
