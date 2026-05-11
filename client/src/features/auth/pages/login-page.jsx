import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../auth-context";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = (values) => {
    const errors = {};
    if (!values.username?.trim()) errors.username = "Username is required.";
    if (!values.password) errors.password = "Password is required.";
    return errors;
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError("");
      await login(values);
      const redirectPath = location.state?.from?.pathname || "/";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <Formik initialValues={{ username: "", password: "" }} validate={validate} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form className="auth-card glass">
            <h1>Welcome back</h1>
            <p className="muted">Sign in to continue discovering and reviewing books on BookVerse.</p>
            <Field className="input" name="username" placeholder="Username" />
            {touched.username && errors.username && <p className="error-text">{errors.username}</p>}
            <Field className="input" type="password" name="password" placeholder="Password" />
            {touched.password && errors.password && <p className="error-text">{errors.password}</p>}
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <p className="muted">
              New here? <Link to="/register">Create your account</Link>
            </p>
          </Form>
        )}
      </Formik>
    </section>
  );
}
