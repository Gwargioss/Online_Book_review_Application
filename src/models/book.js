import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    ISBN: {
      type: String,
      required: true,
      trim: true,
      unique: true, 
      maxlength: 20,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    publisherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    content: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id?.toString();
        ret.publisherId = ret.publisherId?.toString();
        delete ret._id;
        return ret;
      }
    }
  }
);

bookSchema.index({ title: "text", author: "text" });

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);
export default Book;