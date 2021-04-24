const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport')
const UserService = require('./services/UserService');

const setupPassport = () => {
  passport.serializeUser(function(user, done) {
    console.log('serialize user', user);
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    const user = UserService.getUser(id);
    done(null, user);
  });
  
  passport.use(new GoogleStrategy({
    clientID: '17046437582-pbhk4jniie6m0p7llcttm3r4770t6tv2.apps.googleusercontent.com',
    clientSecret: 'fnTOqOhBNLB7wvsU5MkfpHj1',
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
    async function(accessToken, refreshToken, profile, done) {
        const user = await UserService.findByGoogleIdOrCreate(profile);
        return done(null, user);
    }
  ));
}

module.exports = setupPassport;
