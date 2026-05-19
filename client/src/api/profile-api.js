import { http } from "./http-client.js";
 
export async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("image", file);
 
  const res = await http.post("/upload-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
 
  return res.data; // { message, imageUrl, user }
}
 
export async function updateProfile(payload) {
  const res = await http.patch("/auth/me", payload);
  return res.data;
}
