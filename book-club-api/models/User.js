import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 200, unique: true },
    role: { type: String, enum: ["member", "admin"], default: "member" },
    bio: { type: String, maxlength: 500 },
    avatar: { type: String },
    joinedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
