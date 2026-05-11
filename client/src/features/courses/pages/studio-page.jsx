import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { publishCourse } from "../courses-service";

export default function StudioPage() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.ISBN?.trim()) errors.ISBN = "ISBN is required.";
    if (!values.title?.trim()) errors.title = "Title is required.";
    if (!values.author?.trim()) errors.author = "Author is required.";
    return errors;
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setError("");
      setStatus("");
      setLoading(true);
      const response = await publishCourse(values);
      if (!response.success) throw new Error(response.message || "Publishing failed.");
      setStatus(response.message || "Book published successfully.");
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <article className="studio-card glass">
        <h1>Publisher Studio</h1>
        <p className="muted">Add a new book to the BookVerse catalog.</p>
        <Formik
          initialValues={{ ISBN: "", title: "", author: "" }}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="stack">
              <Field className="input" name="ISBN" placeholder="Book ISBN" />
              {touched.ISBN && errors.ISBN && <p className="error-text">{errors.ISBN}</p>}
              <Field className="input" name="title" placeholder="Book title" />
              {touched.title && errors.title && <p className="error-text">{errors.title}</p>}
              <Field className="input" name="author" placeholder="Author name" />
              {touched.author && errors.author && <p className="error-text">{errors.author}</p>}
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Publishing..." : "Publish book"}
              </button>
              {status && <p className="success-text">{status}</p>}
              {error && <p className="error-text">{error}</p>}
            </Form>
          )}
        </Formik>
      </article>
    </section>
  );
}
