import { useState, useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { publishCourse } from "../courses-service";

export default function StudioPage() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [contentMode, setContentMode] = useState("text"); // "text" or "file"
  const [filePreview, setFilePreview] = useState("");

  const validate = (values) => {
    const errors = {};
    if (!values.ISBN?.trim()) errors.ISBN = "ISBN is required.";
    if (!values.title?.trim()) errors.title = "Title is required.";
    if (!values.author?.trim()) errors.author = "Author is required.";
    if (contentMode === "file" && !values.contentFile) {
      errors.contentFile = "Please select a file.";
    }
    return errors;
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      const validTypes = ["text/plain", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        setError("Only TXT and PDF files are supported.");
        return;
      }
      setFieldValue("contentFile", file);
      setFilePreview(file.name);
      setError("");
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setError("");
      setStatus("");
      setLoading(true);

      const payload = {
        ISBN: values.ISBN,
        title: values.title,
        author: values.author,
        content: contentMode === "text" ? values.textContent : ""
      };

      const response = await publishCourse(payload);
      if (!response.success) throw new Error(response.message || "Publishing failed.");

      // If file mode and we have a book ID, upload content separately
      if (contentMode === "file" && values.contentFile && response.data?.book?._id) {
        const formData = new FormData();
        formData.append("contentFile", values.contentFile);

        const contentResponse = await fetch(`/api/v1/books/${response.data.book._id}/content`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
          }
        });

        if (!contentResponse.ok) {
          throw new Error("Failed to upload book content.");
        }
      }

      setStatus(response.message || "Book published successfully.");
      resetForm();
      setFilePreview("");
      setContentMode("text");
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
          initialValues={{
            ISBN: "",
            title: "",
            author: "",
            textContent: "",
            contentFile: null
          }}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="stack">
              <Field className="input" name="ISBN" placeholder="Book ISBN" />
              {touched.ISBN && errors.ISBN && <p className="error-text">{errors.ISBN}</p>}

              <Field className="input" name="title" placeholder="Book title" />
              {touched.title && errors.title && <p className="error-text">{errors.title}</p>}

              <Field className="input" name="author" placeholder="Author name" />
              {touched.author && errors.author && <p className="error-text">{errors.author}</p>}

              <div className="stack">
                <label className="label">Content</label>
                <div className="toggle-group">
                  <button
                    type="button"
                    className={`toggle-btn ${contentMode === "text" ? "active" : ""}`}
                    onClick={() => {
                      setContentMode("text");
                      setFieldValue("contentFile", null);
                      setFilePreview("");
                    }}
                  >
                    📝 Write Text
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${contentMode === "file" ? "active" : ""}`}
                    onClick={() => {
                      setContentMode("file");
                      setFieldValue("textContent", "");
                    }}
                  >
                    📁 Upload File
                  </button>
                </div>

                {contentMode === "text" ? (
                  <Field
                    as="textarea"
                    name="textContent"
                    placeholder="Enter or paste book content here..."
                    className="textarea"
                    rows={8}
                  />
                ) : (
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept=".txt,.pdf"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      className="file-input"
                      id="contentFile"
                    />
                    <label htmlFor="contentFile" className="file-label">
                      <span>📂 Choose TXT or PDF file</span>
                      {filePreview && <p className="file-preview">{filePreview}</p>}
                    </label>
                    {touched.contentFile && errors.contentFile && (
                      <p className="error-text">{errors.contentFile}</p>
                    )}
                  </div>
                )}
              </div>

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

