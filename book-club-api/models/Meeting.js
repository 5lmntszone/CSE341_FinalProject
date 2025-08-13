import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true, index: true },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    startsAt: { type: Date, required: true },
    isOnline: { type: Boolean, default: false },
    meetingUrl: { type: String },           
    location: { type: String, maxlength: 200 }, 
    notes: { type: String, maxlength: 1000 },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);
