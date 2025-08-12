import Review from "../models/Review.js";

export const listReviews = async (req, res, next) => {
  try {
    const { bookId } = req.query;
    const q = bookId ? { bookId } : {};
    const reviews = await Review.find(q).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e) { next(e); }
};

export const createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (e) { next(e); }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (e) { next(e); }
};
