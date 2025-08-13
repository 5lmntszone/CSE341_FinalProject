import Book from "../models/Book.js";

export const listBooks = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") {
      throw new Error("Forced 500 error for testing");
    }

    const { search, sort } = req.query;
    const q = search ? { title: new RegExp(search, "i") } : {};
    const s = sort ? { [sort]: 1 } : { createdAt: -1 };
    const books = await Book.find(q).sort(s);
    res.json(books);
  } catch (e) {
    next(e);
  }
};

export const getBook = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") {
      throw new Error("Forced 500 error for testing");
    }

    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (e) {
    next(e);
  }
};

export const createBook = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") {
      throw new Error("Forced 500 error for testing");
    }

    if ("_id" in req.body) delete req.body._id;
    const book = await Book.create(req.body);
    return res.status(201).json(book);
  } catch (e) {
    next(e);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") {
      throw new Error("Forced 500 error for testing");
    }

    const book = await Book.findByIdAndUpdate(
      req.params.bookId, req.body, { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (e) {
    next(e);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") {
      throw new Error("Forced 500 error for testing");
    }

    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (e) {
    next(e);
  }
};
