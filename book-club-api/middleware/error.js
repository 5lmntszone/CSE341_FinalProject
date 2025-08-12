export const notFound = (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.status && err.status !== 500) {
    return res.status(err.status).json({ message: err.message || "Error" });
  }

  return res.status(500).json({
    message: "Internal server error",
    details:
      process.env.NODE_ENV === "production"
        ? undefined
        : err.message || "Unexpected error",
  });
};
