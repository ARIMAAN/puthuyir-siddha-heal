const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { createOTP, sendOTPEmail } = require("./otpService");

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/google/callback`
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
        // New user - needs OTP verification and password setup
        user = await User.create({
          ...googleData,
          is_verified: false, // Set to false for new OAuth users
          account_verified: false, // New account verification flag
          password_setup_required: true, // OAuth users must set password after verification
          password_setup_completed: false,
          has_password: false
        });
        
        // Send OTP for verification
        try {
          const otp = await createOTP(user.email, "account_verification");
          await sendOTPEmail(user.email, otp, "account_verification");
          console.log(`📧 OTP sent to new OAuth user: ${user.email}`);
        } catch (otpError) {
          console.error("Failed to send OTP to new OAuth user:", otpError);
        }
        
        return done(null, { ...user.toObject(), needsVerification: true });
      } else {
        // Existing user - check account verification status
        const needsVerification = !user.account_verified;
        
        Object.assign(user, {
          ...googleData,
          is_verified: user.account_verified ? true : user.is_verified, // Keep verification status
          last_login: new Date()
        });
        await user.save();
        
        if (needsVerification) {
          // Send OTP for first-time OAuth users who haven't verified their account
          try {
            const otp = await createOTP(user.email, "account_verification");
            await sendOTPEmail(user.email, otp, "account_verification");
            console.log(`📧 OTP sent to existing unverified OAuth user: ${user.email}`);
          } catch (otpError) {
            console.error("Failed to send OTP to existing OAuth user:", otpError);
          }
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
