const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");
const loginValidate = require("../utilities/account-validation");

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement),
);
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister),
);
router.get(
  "/management",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement),
);
router.get(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate),
);
router.get("/logout", utilities.handleErrors(accountController.logOut));

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount),
);
router.post(
  "/login",
  loginValidate.loginRules(),
  loginValidate.checkLoginData,
  utilities.handleErrors(accountController.loginAccount),
);

router.post(
  "/update-info",
  regValidate.updateInfoRules(),
  regValidate.checkUpdateInfoData,
  utilities.handleErrors(accountController.updateAccountInfo),
);
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword),
);

module.exports = router;
