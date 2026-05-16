import { http } from "../../api/http-client";
import { normalizeApiResponse } from "../../shared/utils/response";

export async function loginRequest(payload) {
  const res = await http.post("/auth/login", payload);
  return normalizeApiResponse(res.data);
}

export async function registerRequest(payload) {
  const res = await http.post("/auth/register", payload);
  return normalizeApiResponse(res.data);
}

export async function refreshRequest() {
  const res = await http.post("/auth/refresh", {});
  return normalizeApiResponse(res.data);
}

export async function meRequest() {
  const res = await http.get("/auth/me");
  return normalizeApiResponse(res.data);
}

export async function uploadProfilePictureRequest(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await http.post("/upload-profile", formData);
  return normalizeApiResponse(res.data);
}

export async function updateProfileRequest(payload) {
  const res = await http.put("/auth/profile", payload);
  return normalizeApiResponse(res.data);
}

export async function logoutRequest() {
  const res = await http.post("/auth/logout", {});
  return normalizeApiResponse(res.data);
}
