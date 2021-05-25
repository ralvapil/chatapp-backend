const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const passport = require("passport");
const UserService = require("./services/UserService");

const setupPassport = () => {
  passport.serializeUser((user, done) => {
    console.log("serialize user", user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserService.getUser(id);
    done(null, user);
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "17046437582-pbhk4jniie6m0p7llcttm3r4770t6tv2.apps.googleusercontent.com",
        clientSecret: "fnTOqOhBNLB7wvsU5MkfpHj1",
        callbackURL:
          "https://limitless-inlet-11254.herokuapp.com/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await UserService.findByGoogleIdOrCreate(profile);
        return done(null, user);
      }
    )
  );
};

module.exports = setupPassport;
