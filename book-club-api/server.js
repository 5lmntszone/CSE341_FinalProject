import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";

import booksRoutes from "./routes/booksRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import meetingsRoutes from "./routes/meetingsRoutes.js";
import { swaggerMiddleware } from "./swagger/swagger.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

app.set("trust proxy", 1);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, 
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", authRoutes);
app.use("/books", booksRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/users", usersRoutes);
app.use("/meetings", meetingsRoutes);
app.use("/api-docs", ...swaggerMiddleware);

app.get("/", (_req, res) => res.json({ message: "Book Club API up" }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

export default app;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
    }
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });
