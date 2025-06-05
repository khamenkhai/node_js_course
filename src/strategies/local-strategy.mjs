import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
    console.log(`\n=> Inside serialized user `, user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log(`\n=> Inside deserialized user `, id);
        const findUser = await User.findById(id);
        if (!findUser) return done(new Error("User Not Found"), null);
        return done(null, findUser);
    } catch (e) {
        return done(e, null);
    }
});

passport.use(
    new LocalStrategy(async (username, password, done) => {
        console.log(`username: ${username}`);
        console.log(`password: ${password}`);
        try {
            const findUser = await User.findOne({ username });
            console.log(`user! ${findUser}`);
            console.log(`password! ${findUser.password}`);
            console.log(`current password! ${password}`);
            if (!findUser) throw new Error("User not found!");
            if (!comparePassword(password, findUser.password)) throw new Error("Bad credentials!");
            return done(null, findUser);
        } catch (e) {
            return done(e, null);
        }
    })
);

export default passport;
