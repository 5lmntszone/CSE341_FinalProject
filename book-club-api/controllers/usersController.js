import User from "../models/User.js";

export const listUsers = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") throw new Error("Forced 500 error for testing");
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (e) { next(e); }
};

export const getUser = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") throw new Error("Forced 500 error for testing");
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) { next(e); }
};

export const createUser = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") throw new Error("Forced 500 error for testing");
    if ("_id" in req.body) delete req.body._id;
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (e) { next(e); }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") throw new Error("Forced 500 error for testing");
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) { next(e); }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") throw new Error("Forced 500 error for testing");
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (e) { next(e); }
};
