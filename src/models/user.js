import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      minlength: 3,
      maxlength: 32
    },
    name: {
      type: String,
      trim: true,
      maxlength: 80,
      default: ""
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 120,
      default: ""
    },
    profilePicture: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    tokenVersion: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.passwordHash;
        return ret;
      }
    }
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
