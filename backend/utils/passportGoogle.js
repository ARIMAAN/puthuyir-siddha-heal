const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { createOTP, sendOTPEmail } = require("./otpService");

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });

      const googleData = {
        full_name: profile.displayName,
        email: profile.emails[0].value,
        oauth_provider: "google",
        oauth_id: profile.id,
        is_verified: true,
        profile_picture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
        first_name: profile.name ? profile.name.givenName : null,
        last_name: profile.name ? profile.name.familyName : null,
        google_profile: {
          id: profile.id,
          displayName: profile.displayName,
          photos: profile.photos || [],
          locale: profile._json.locale || null,
          verified_email: profile._json.verified_email || false
        }
      };

      if (!user) {
        user = await User.create({
          ...googleData,
          is_verified: false,
          account_verified: false,
          password_setup_required: true,
          password_setup_completed: false,
          has_password: false
        });
        try {
          const otp = await createOTP(user.email, "account_verification");
          await sendOTPEmail(user.email, otp, "account_verification");
        } catch {}
        return done(null, { ...user.toObject(), needsVerification: true });
      } else {
        const needsVerification = !user.account_verified;
        Object.assign(user, {
          ...googleData,
          is_verified: user.account_verified ? true : user.is_verified,
          last_login: new Date()
        });
        await user.save();
        if (needsVerification) {
          try {
            const otp = await createOTP(user.email, "account_verification");
            await sendOTPEmail(user.email, otp, "account_verification");
          } catch {}
        }
        return done(null, { ...user.toObject(), needsVerification });
      }
    } catch (error) {
      return done(error, null);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));
};


