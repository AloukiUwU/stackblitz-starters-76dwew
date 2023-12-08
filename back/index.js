const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const secureRoute = require("./routes/secure-routes");

const routes = require("./routes/routes");
require("./auth/auth");

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`This app is listening on port ${port}`);
});

app.use(routes);
app.use(secureRoute);

app.get("/", (req,res) => {
  res.send(
    "Welcome to CUM Prototype Application ! Try to login to test our features!"
  );
});