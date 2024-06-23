require("dotenv").config();
const mongoose = require("mongoose");


mongoose.connect(process.env.DB_HOST)
    .then(() => console.log("Connection established"))
    .catch((err) => console.log(err));
