let express = require("express");

let user = require("./routes/user");
let quest = require("./routes/quest");

let routes = express.Router();
routes.use("/user", user);
routes.use("/quest", quest);

module.exports = routes;
