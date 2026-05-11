import { AuthProvider } from "../features/auth/auth-context";

export function AppProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
