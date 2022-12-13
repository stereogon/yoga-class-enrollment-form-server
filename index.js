const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const dbURI = process.env.MONGO_URL;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const whitelist = [
  "https://stereogon.github.io/",
  "https://stereogon.github.io",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/users", require("./src/routes/userRoutes"));

app.listen(PORT, () => {
  console.log(`Server is Listening on Port ${PORT}`);
});
