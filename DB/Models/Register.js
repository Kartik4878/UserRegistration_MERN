const hash = require("../../Utility/Hash");
const mongoose = require("mongoose");
const token = require("../../Utility/Token")
const register_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"],
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

register_schema.methods.generateToken = async function () {
    try {
        const newToken = await token.returnWebToken({ _id: this._id.toString() });
        this.tokens = this.tokens.concat({ token: newToken });
        this.save();
        return newToken;
    } catch (error) {
        console.log("Error adding token :" + error);
    }
}

register_schema.pre("save", async function (next) {
    this.password = await hash.hashData(this.password, true);
    next();
})

const Register = new mongoose.model("Register", register_schema);

module.exports = Register;