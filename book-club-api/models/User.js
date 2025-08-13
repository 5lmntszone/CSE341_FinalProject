import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    githubId: { type: String, index: true, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    username: { type: String, trim: true },
    email: {
      type: String,
      trim: true,
      match: /.+\@.+\..+/,
      sparse: true, 
    },
    avatar: { type: String, trim: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
