import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: "/api-docs" }),
  (req, res) => res.redirect("/api-docs")
);

router.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  res.json(req.user);
});

router.post("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session?.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });
});

export default router;
