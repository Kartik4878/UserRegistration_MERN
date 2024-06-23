const Register = require("../Models/Register");
const token = require("../../Utility/Token");


const auth = async (req, res, next) => {
    const userToken = req.cookies.jwt;
    try {
        const verifyToken = await token.verifyWebToken(userToken, process.env.SECRET_KEY);
        const user = await Register.findOne({ _id: verifyToken._id });
        req.user = user;
        req.token = userToken;
        next();
    } catch (error) {
        res.status(401).render("Login");
    }
}

module.exports = auth;
