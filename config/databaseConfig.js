const mongoose = require("mongoose");
const MONGODB_URL = process.env.MONGODB_URL;

const connectDatabase= () => {
  mongoose
    .connect(MONGODB_URL)
    .then(() => console.log("connected to DB"))
    .catch((err) => console.log(err.message));
};

module.exports = connectDatabase;
