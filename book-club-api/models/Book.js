import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, default: "General" },
    summary: { type: String, maxlength: 1000 },
    publishedYear: { type: Number, min: 0 },
    ISBN: { type: String, unique: true, sparse: true },
    coverImage: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
