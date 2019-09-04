const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/*
//get info for createAccount
app.post("/createAccount", (req, res) => {
  console.log("rwhoops");
});
*/

// Setting up basic middleware for all Express requests
app.use(logger("dev")); // Log requests to API using morgan

// Enable CORS from client-side
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

const apiRoutes = express.Router();
const profileRoutes = require("./router.js");

apiRoutes.use("/profile", profileRoutes);

app.use("/api", apiRoutes);

const port = process.env.PORT || 5000;
app.listen(port);

console.log("App is listening on port " + port);
