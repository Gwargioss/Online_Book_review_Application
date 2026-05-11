import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../auth-context";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = (values) => {
    const errors = {};
    if (!values.username?.trim() || values.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }
    if (!values.password || values.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }
    return errors;
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError("");
      const result = await register(values);
      if (!result.success) throw new Error(result.message || "Registration failed.");
      navigate("/login", { replace: true });
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
            <h1>Create account</h1>
            <p className="muted">Build your BookVerse profile.</p>
            <Field className="input" name="username" placeholder="Username" />
            {touched.username && errors.username && <p className="error-text">{errors.username}</p>}
            <Field className="input" type="password" name="password" placeholder="Password" />
            {touched.password && errors.password && <p className="error-text">{errors.password}</p>}
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
            <p className="muted">
              Already registered? <Link to="/login">Sign in</Link>
            </p>
          </Form>
        )}
      </Formik>
    </section>
  );
}
