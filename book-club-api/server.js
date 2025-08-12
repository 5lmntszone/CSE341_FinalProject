import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import booksRoutes from "./routes/booksRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";
import { swaggerMiddleware } from "./swagger/swagger.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/books", booksRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/api-docs", ...swaggerMiddleware);

app.get("/", (_req, res) => res.json({ message: "Book Club API up" }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
})
.catch(err => {
  console.error("DB connection error:", err);
  process.exit(1);
});
