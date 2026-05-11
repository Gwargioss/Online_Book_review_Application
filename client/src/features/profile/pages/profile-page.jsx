import { useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../../auth/auth-context";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const joined = useMemo(() => new Date().toLocaleDateString(), []);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const validate = (values) => {
    const errors = {};
    if (!values.name?.trim()) errors.name = "Name is required.";
    if (!values.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Valid email is required.";
    }
    if (!values.profilePicture?.trim() || !/^https?:\/\/.+/.test(values.profilePicture)) {
      errors.profilePicture = "A valid image URL is required.";
    }
    return errors;
  };

  const onSubmit = async (values) => {
    try {
      setError("");
      setStatus("");
      await updateProfile(values);
      setStatus("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page">
      <article className="profile-card glass">
        <h1>Your BookVerse profile</h1>
        <img
          src={user?.profilePicture || "https://via.placeholder.com/150"}
          alt="Profile"
          className="profile-picture"
        />
        <Formik
          initialValues={{
            name: user?.name || "",
            email: user?.email || "",
            profilePicture: user?.profilePicture || "https://via.placeholder.com/150"
          }}
          validate={validate}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form className="stack">
              <Field className="input" name="name" placeholder="Full name" />
              {touched.name && errors.name && <p className="error-text">{errors.name}</p>}
              <Field className="input" type="email" name="email" placeholder="Email" />
              {touched.email && errors.email && <p className="error-text">{errors.email}</p>}
              <Field className="input" name="profilePicture" placeholder="Profile image URL" />
              {touched.profilePicture && errors.profilePicture && (
                <p className="error-text">{errors.profilePicture}</p>
              )}
              <button className="btn btn-primary" type="submit">
                Save profile
              </button>
              {status && <p className="success-text">{status}</p>}
              {error && <p className="error-text">{error}</p>}
            </Form>
          )}
        </Formik>
        <div className="profile-grid">
          <div>
            <p className="muted">Username</p>
            <h3>{user?.username}</h3>
          </div>
          <div>
            <p className="muted">Member since</p>
            <h3>{joined}</h3>
          </div>
          <div>
            <p className="muted">Favorite genre</p>
            <h3>Fiction &amp; novels</h3>
          </div>
          <div>
            <p className="muted">Books reviewed</p>
            <h3>12</h3>
          </div>
        </div>
      </article>
    </section>
  );
}
