import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true, index: true },
    review_text: { type: String, required: true, trim: true, maxlength: 2000 }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        return ret;
      }
    }
  }
);

reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;
