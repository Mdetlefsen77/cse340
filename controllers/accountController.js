const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs"); // Asegúrate de tener bcryptjs instalado
const jwt = require("jsonwebtoken");

async function buildLogin(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/login", { title: "Login", nav, errors: null });
}

async function buildRegister(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/register", { title: "Register", nav, errors: null });
}

async function registerAccount(req, res, next) {
  const nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const hashedPassword = bcrypt.hashSync(account_password, 10);

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  );

  if (regResult) {
    req.flash(
      "success",
      `Congratulations ${account_firstname}, you're registered! Please log in.`,
    );
    res.status(201).redirect("/account/login");
  } else {
    req.flash("error", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function loginAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 },
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/management");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again.",
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  const clientName = res.locals.accountData.account_firstname;
  const clientType = res.locals.accountData.account_type;
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    clientName,
    clientType,
  });
}

/* ****************************************
 *  Build account update view
 * ************************************ */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav();
  const account_id = parseInt(res.locals.accountData.account_id);
  const accountData = await accountModel.getAccountById(account_id);
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    original_email: accountData.account_email,
    account_id: accountData.account_id,
  });
}

/* ****************************************
 *  Process account information update
 * ************************************ */
async function updateAccountInfo(req, res, next) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    original_email,
  } = req.body;

  // Check if email is being changed and if it already exists
  if (account_email !== original_email) {
    const emailExists = await accountModel.checkExistingEmail(account_email);
    if (emailExists) {
      req.flash(
        "notice",
        "Email is already in use. Please use a different email.",
      );
      return res.status(400).render("account/update", {
        title: "Update Account Information",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        original_email,
        account_id,
      });
    }
  }

  const updateResult = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  );

  if (updateResult) {
    // Update the JWT token with new information
    const accountData = await accountModel.getAccountById(account_id);
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600 * 1000,
    });
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }

    req.flash(
      "success",
      "Your account information has been updated successfully.",
    );
    res.redirect("/account/management");
  } else {
    req.flash("notice", "Sorry, the update failed. Please try again.");
    res.status(501).render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      original_email,
      account_id,
    });
  }
}

/* ****************************************
 *  Process password update
 * ************************************ */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  // Hash the new password
  const hashedPassword = bcrypt.hashSync(account_password, 10);

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword,
  );

  if (updateResult) {
    req.flash(
      "success",
      "Your password has been updated successfully. Please log in with your new password.",
    );
    res.clearCookie("jwt");
    res.redirect("/account/login");
  } else {
    const accountData = await accountModel.getAccountById(account_id);
    req.flash("notice", "Sorry, the password update failed. Please try again.");
    res.status(501).render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      original_email: accountData.account_email,
      account_id: accountData.account_id,
    });
  }
}

/* ****************************************
 *  Process logout
 * ************************************ */
async function logOut(req, res, next) {
  res.clearCookie("jwt");
  req.flash("success", "You have been logged out successfully.");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  buildAccountManagement,
  buildAccountUpdate,
  updateAccountInfo,
  updatePassword,
  logOut,
};
