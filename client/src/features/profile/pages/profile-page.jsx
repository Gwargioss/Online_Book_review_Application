import { useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../../auth/auth-context";

const GENRE_OPTIONS = [
  "Fiction",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Thriller",
  "Non-fiction",
  "Biography",
  "History",
  "Self-help",
  "Young Adult",
  "Poetry"
];

export default function ProfilePage() {
  const { user, updateProfile, uploadProfilePicture } = useAuth();
  const joined = useMemo(() => new Date().toLocaleDateString(), []);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.name?.trim()) errors.name = "Name is required.";
    if (!values.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Valid email is required.";
    }
    if (values.profilePicture?.trim() && !/^https?:\/\/.+/.test(values.profilePicture)) {
      errors.profilePicture = "A valid image URL is required.";
    }
    if (!values.favoriteGenre?.trim()) {
      errors.favoriteGenre = "Favorite genre is required.";
    }
    return errors;
  };

  const handleFileUpload = async (event, setFieldValue) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadStatus("");
    setUploading(true);

    try {
      const response = await uploadProfilePicture(file);
      if (!response.success) throw new Error(response.message || "Upload failed.");
      const imageUrl = response.data?.user?.profilePicture || response.data?.imageUrl;
      if (imageUrl) {
        setFieldValue("profilePicture", imageUrl);
      }
      setUploadStatus("Profile image uploaded successfully.");
    } catch (err) {
      setUploadError(err.message || "Unable to upload image.");
    } finally {
      setUploading(false);
    }
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
        <Formik
          initialValues={{
            name: user?.name || "",
            email: user?.email || "",
            profilePicture: user?.profilePicture || "",
            favoriteGenre: user?.favoriteGenre || ""
          }}
          validate={validate}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue }) => (
            <>
              <img
                src={values.profilePicture || user?.profilePicture || "https://via.placeholder.com/150"}
                alt="Profile"
                className="profile-picture"
              />
              <Form className="stack">
                <Field className="input" name="name" placeholder="Full name" />
                {touched.name && errors.name && <p className="error-text">{errors.name}</p>}

                <Field className="input" type="email" name="email" placeholder="Email" />
                {touched.email && errors.email && <p className="error-text">{errors.email}</p>}

                <Field className="input" name="profilePicture" placeholder="Profile image URL" />
                {touched.profilePicture && errors.profilePicture && (
                  <p className="error-text">{errors.profilePicture}</p>
                )}

                <div className="file-upload">
                  <label className="file-upload-label" htmlFor="profileImageFile">
                    Upload from device
                  </label>
                  <input
                    id="profileImageFile"
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileUpload(event, setFieldValue)}
                  />
                  {uploading && <p className="muted">Uploading image...</p>}
                  {uploadStatus && <p className="success-text">{uploadStatus}</p>}
                  {uploadError && <p className="error-text">{uploadError}</p>}
                </div>

                <Field
                  className="input"
                  list="genre-options"
                  name="favoriteGenre"
                  placeholder="Favorite genre"
                />
                <datalist id="genre-options">
                  {GENRE_OPTIONS.map((genre) => (
                    <option key={genre} value={genre} />
                  ))}
                </datalist>
                {touched.favoriteGenre && errors.favoriteGenre && (
                  <p className="error-text">{errors.favoriteGenre}</p>
                )}

                <button className="btn btn-primary" type="submit">
                  Save profile
                </button>
                {status && <p className="success-text">{status}</p>}
                {error && <p className="error-text">{error}</p>}
              </Form>
            </>
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
            <h3>{user?.favoriteGenre || "Not set"}</h3>
          </div>
          <div>
            <p className="muted">Books reviewed</p>
            <h3>{user?.bookCount ?? 0}</h3>
          </div>
        </div>
      </article>
    </section>
  );
}
