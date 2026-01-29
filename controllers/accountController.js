const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs"); // Asegúrate de tener bcryptjs instalado

async function buildLogin(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/login", { title: "Login", nav, errors: null });
}

async function buildRegister(req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/register", { title: "Register", nav, errors: null });
}

async function registerAccount(req, res, next) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const hashedPassword = await bcrypt.hash(account_password, 10);

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

async function loginAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.lognAccount(account_email);

    if (!accountData) {
      req.flash("error", "Invalid email or password. Please try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }

    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password,
    );

    if (!passwordMatch) {
      req.flash("error", "Invalid email or password. Please try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }

    req.flash(
      "success",
      `Login was successful, ${accountData.account_firstname}!`,
    );
    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "An error occurred during login. Please try again.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount };
