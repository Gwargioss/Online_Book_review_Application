import User from "../models/user.js";

export async function findByUsername(username, { withPassword = false } = {}) {
  const query = User.findOne({ username: username.toLowerCase() });
  if (withPassword) query.select("+passwordHash");
  return query.exec();
}

export async function findById(userId) {
  return User.findById(userId).exec();
}

export async function createUser({ username, passwordHash }) {
  return User.create({ username: username.toLowerCase(), passwordHash });
}

export async function incrementTokenVersion(userId) {
  return User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } }, { new: true }).exec();
}

export async function updateProfile(userId, payload) {
  const update = {
    name: payload.name,
    profilePicture: payload.profilePicture,
    favoriteGenre: payload.favoriteGenre || ""
  };

  if (typeof payload.email === "string") {
    update.email = payload.email.toLowerCase();
  }

  return User.findByIdAndUpdate(userId, { $set: update }, { new: true }).exec();
}
