import { Link, NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../../features/auth/auth-context";

export function AppShell({ children }) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="app-frame">
      <header className="top-nav glass">
        <Link className="brand" to={ROUTES.home}>
          <span className="brand-mark">B</span>BookVerse
        </Link>
        <nav className="nav-links">
          <NavLink to={ROUTES.home}>Books</NavLink>
          {isAuthenticated && <NavLink to={ROUTES.dashboard}>Dashboard</NavLink>}
          {isAuthenticated && <NavLink to={ROUTES.instructorStudio}>Publish</NavLink>}
          {isAuthenticated && <NavLink to={ROUTES.profile}>Profile</NavLink>}
        </nav>
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="user-pill">{user?.username || "Learner"}</span>
              <button className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className="btn btn-ghost" to={ROUTES.login}>
                Sign in
              </NavLink>
              <NavLink className="btn btn-primary" to={ROUTES.register}>
                Join now
              </NavLink>
            </>
          )}
        </div>
      </header>

      <main className="content">{children}</main>

      <footer className="site-footer">
        <p>BookVerse - Discover, track, and review your books.</p>
      </footer>
    </div>
  );
}
