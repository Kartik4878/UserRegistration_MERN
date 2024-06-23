const jwt = require("jsonwebtoken");
require("dotenv").config();


const returnWebToken = async (data) => {
    const webToken = await jwt.sign(data, process.env.SECRET_KEY, { expiresIn: "2 minutes" });
    return webToken;
}

const verifyWebToken = async (data) => {
    const verification = await jwt.verify(data, process.env.SECRET_KEY);
    return verification;
}

module.exports = {
    returnWebToken, verifyWebToken
}