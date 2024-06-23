const express = require("express");
const Register = require("./DB/Models/Register");
const path = require("path");
const hbs = require("hbs");
const hash = require("./Utility/Hash")
require("./DB/DBConn/DBConn");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const token = require("./Utility/Token");
const cookieParser = require("cookie-parser");
const auth = require("./DB/DBConn/auth");





const viewsPath = path.join(__dirname, "./Templates/views");
const partialsPath = path.join(__dirname, "./Templates/partials");

const app = express();
app.set("view engine", "hbs");
app.set("views", viewsPath);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
hbs.registerPartials(partialsPath);



const port = process.env.port || 4001;


app.get("/", auth, (req, res) => {
    res.render("index");
})

app.get("/registerNew", auth, (req, res) => {
    res.render("NewRegistration");
})

app.get("/login", (req, res) => {
    res.render("Login");
})

app.get("/logout", auth, (req, res) => {
    try {
        // req.user.tokens = req.user.tokens.filter((currElement) => currElement.token !== req.token);
        req.user.tokens = [];
        req.user.save();
        res.clearCookie("jwt");
        res.status(200).render("Login");
    } catch (error) {
        res.send(500).send("Internal server error");
    }

})

app.get("*", auth, (req, res) => {
    res.render("NotFound");
})


app.post("/", async (req, res) => {
    try {
        const user = await Register.findOne({ "email": req.body?.user_name });
        if (user) {
            const matchPassword = await hash.comapreHashData(req.body?.user_password, user?.password);
            if (matchPassword) {
                const newToken = await user.generateToken();
                res.cookie("jwt", newToken, {
                    expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE)),
                    httpOnly: true
                })
                res.status(200).render("index");
            } else {
                res.status(401).send({ "message": "Incorrect user ID or Password" });
            }
        } else {
            res.status(401).send({ "message": "Incorrect user ID or Password" });
        }
    } catch (error) {
        res.status(400).send({ "message": error });
    }
})


app.post("/register", async (req, res) => {
    try {
        const newRegister = new Register(req.body);
        const newToken = await newRegister.generateToken();
        res.cookie("jwt", newToken, {
            expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE)),
            httpOnly: true
        })
        res.status(200).render("index");
    } catch (error) {
        res.status(400).send({ "message": error?.errorResponse?.errmsg });
    }
})

app.listen(port, () => console.log(`listening on ${port}`));