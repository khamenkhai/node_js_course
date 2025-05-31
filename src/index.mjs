import express from 'express';
import routes from "./routes/index.mjs";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUsers } from './utils/constants.mjs';
import passport from 'passport';
import initializePassport from './strategies/local-strategy.mjs';


// Middleware for logging requests
const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
};

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Provide secret key for signed cookies
app.use(cookieParser("my_secret_key"));
app.use(session({
    secret: "kham the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(loggingMiddleware);
app.use(routes);

app.get("/", (req, res) => {
    console.log("sessions => ");
    console.log(req.session);
    console.log("sessions id => ");
    console.log(req.session.id);
    req.session.visited = true;
    console.log("Unsigned cookies:", req.cookies);
    console.log("Signed cookies:", req.signedCookies);
    res.send("Hello world");
});

app.get("/setCookie", (req, res) => {
    // 🍪 Setting a signed cookie
    res.cookie("hello", "world", { signed: true });
    res.send("Hola Amigo!");
});

app.post("/api/auth", passport.authenticate('local'), (req, res) => {});

app.get("/api/auth/status", (req, res) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log("session!");
        console.log(session);
    })
    return req.session.user ? res.status(200).send(req.session.user) : res.status(401).send({ message: "Not authenticated!!!" })
})

app.post("/api/cart", (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated!" });
    }

    const { body: item } = req;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    req.session.cart.push(item);

    return res.status(201).json(item);
});

app.get("/api/cart", (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated!" });
    }

    return res.send(req.session.cart ?? [])
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
