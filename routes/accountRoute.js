const express = require("express");
const router = new express.Router();
const { buildLogin, buildRegister, registerAccount, loginAccount } = require("../controllers/accountController");
const utilities = require("../utilities/");


router.get("/login", utilities.handleErrors(buildLogin)
);
router.get("/register", utilities.handleErrors(buildRegister));

router.post("/register", utilities.handleErrors(registerAccount));
router.post("/login", utilities.handleErrors(loginAccount));

module.exports = router;