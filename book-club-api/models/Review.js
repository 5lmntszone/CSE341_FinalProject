import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const reviewSchema = new mongoose.Schema({
  bookId:   { type: ObjectId, ref: "Book", required: true },
  userName: { type: String, required: true, trim: true }, 
  rating:   { type: Number, min: 1, max: 5, required: true },
  comment:  { type: String, maxlength: 1000 },
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
