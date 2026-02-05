const express = require("express");
const router = new express.Router();
const {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  buildAccountManagement,
} = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");
const loginValidate = require("../utilities/account-validation");

router.get("/", utilities.checkLogin);
router.get("/login", utilities.handleErrors(buildLogin));
router.get("/register", utilities.handleErrors(buildRegister));
router.get("/management", utilities.handleErrors(buildAccountManagement));

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(registerAccount),
);
router.post(
  "/login",
  loginValidate.loginRules(),
  loginValidate.checkLoginData,
  utilities.handleErrors(loginAccount),
);

module.exports = router;
