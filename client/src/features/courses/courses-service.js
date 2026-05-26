import { http } from "../../api/http-client";
import { normalizeApiResponse } from "../../shared/utils/response";

export async function getAllCourses(signal) {
  const res = await http.get("/books", { signal });
  return normalizeApiResponse(res.data);
}

export async function searchCoursesByTitle(title) {
  const res = await http.post("/books/byTitle", { title });
  return normalizeApiResponse(res.data);
}

export async function searchCoursesByInstructor(author) {
  const res = await http.post("/books/byAuthor", { author });
  return normalizeApiResponse(res.data);
}

export async function publishCourse(coursePayload) {
  const res = await http.post("/books", coursePayload);
  return normalizeApiResponse(res.data);
}

export async function removeCourse(bookId) {
  const res = await http.delete(`/books/${bookId}`);
  return normalizeApiResponse(res.data);
}
