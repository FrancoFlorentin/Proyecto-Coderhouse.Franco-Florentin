import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { cookieExtractor } from '../utils.js'
import User from '../daos/mongodb/models/user.model.js'

export const setupCurrentStrategy = () => {
  passport.use("current", new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.sub).lean();
          if (!user) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    ))
}