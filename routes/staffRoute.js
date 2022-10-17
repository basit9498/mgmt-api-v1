const express = require("express");
const staffController = require("../controller/staffController");
const route = express.Router();

route.post("/register", staffController.registerStaff);

module.exports = route;
