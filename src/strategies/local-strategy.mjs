import passport from "passport";
import { Strategy } from "passport-local";
import { Strategy as LocalStrategy } from 'passport-local';
import { mockUsers } from "../utils/constants.mjs";

passport.serializeUser((user, done) => {
    done(null, user);
})

export default passport.use(
    new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
        console.log(`username : ${username}`);
        console.log(`password : ${password}`);
        try {
            const findUser = mockUsers.find(user => user.username === username);
            if (!findUser) throw new Error("user not found!");
            if (findUser.password !== password)
                throw new Error("Invalid Credentials");
            done(null, findUser)
        } catch (e) {
            done(e, null);
        }
    })
);
