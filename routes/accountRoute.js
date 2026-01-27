const express = require("express");
const router = new express.Router();
const { buildLogin } = require("../controllers/accountController");
const utilities = require("../utilities/");


router.get("/login", utilities.handleErrors(buildLogin)
);

module.exports = router;