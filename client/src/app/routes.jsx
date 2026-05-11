import { Navigate } from "react-router-dom";
import HomePage from "../features/courses/pages/home-page";
import CourseDetailsPage from "../features/courses/pages/course-details-page";
import StudioPage from "../features/courses/pages/studio-page";
import LoginPage from "../features/auth/pages/login-page";
import RegisterPage from "../features/auth/pages/register-page";
import ProfilePage from "../features/profile/pages/profile-page";
import DashboardPage from "../features/dashboard/pages/dashboard-page";
import { AppShell } from "../shared/components/layout/app-shell";
import { ProtectedRoute } from "../shared/components/layout/protected-route";
import { ROUTES } from "../shared/constants/routes";

export const appRoutes = [
  {
    path: ROUTES.home,
    element: (
      <AppShell>
        <HomePage />
      </AppShell>
    )
  },
  {
    path: ROUTES.bookDetails,
    element: (
      <AppShell>
        <CourseDetailsPage />
      </AppShell>
    )
  },
  {
    path: ROUTES.login,
    element: (
      <AppShell>
        <LoginPage />
      </AppShell>
    )
  },
  {
    path: ROUTES.register,
    element: (
      <AppShell>
        <RegisterPage />
      </AppShell>
    )
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.dashboard,
        element: (
          <AppShell>
            <DashboardPage />
          </AppShell>
        )
      },
      {
        path: ROUTES.instructorStudio,
        element: (
          <AppShell>
            <StudioPage />
          </AppShell>
        )
      },
      {
        path: ROUTES.profile,
        element: (
          <AppShell>
            <ProfilePage />
          </AppShell>
        )
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.home} replace />
  }
];
