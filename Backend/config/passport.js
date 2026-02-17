import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

passport.use(
    new LocalStrategy(
        {
            usernameField: "identifier",
            passwordField: "password",
        },
        async (identifier, password, done) => {
            try {
                const user = await User.findOne({
                    $or: [{email: identifier},
                        {collegeId: identifier}
                    ],
                });

                if(!user) {
                    return done(null, false);
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if(!isMatch) {
                    return done(null, false);
                }

                return done(null, user);
            } catch(err) {
                done(err);
            }
        }
    )
);

export default passport;