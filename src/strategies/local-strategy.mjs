import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { mockUsers } from "../utils/constants.mjs";

passport.serializeUser((user, done) => {
    console.log(`\n=> Inside serialized user `, user);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    try {
        console.log(`\n=> Inside deserialized user `, id);
        const findUser = mockUsers.find(user => user.id === id);
        if (!findUser) return done(new Error("User Not Found"), null);
        return done(null, findUser);
    } catch (e) {
        return done(e, null);
    }
});

passport.use(
    new LocalStrategy((username, password, done) => {
        console.log(`username: ${username}`);
        console.log(`password: ${password}`);
        try {
            const findUser = mockUsers.find(user => user.username === username);
            if (!findUser) return done(null, false, { message: "User not found" });
            if (findUser.password !== password)
                return done(null, false, { message: "Invalid credentials" });
            return done(null, findUser);
        } catch (e) {
            return done(e);
        }
    })
);

export default passport;
