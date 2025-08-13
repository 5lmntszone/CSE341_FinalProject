import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const u = await User.findById(id).lean();
    done(null, u);
  } catch (e) {
    done(e);
  }
});

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.OAUTH_CALLBACK_URL,
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const emails = profile.emails || [];
      const primaryEmail =
        emails.find(e => e.verified)?.value ||
        emails[0]?.value ||
        null;

      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          name: profile.displayName || profile.username || "GitHub User",
          email: primaryEmail,                   
          avatar: profile.photos?.[0]?.value || null,
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

export default passport;
