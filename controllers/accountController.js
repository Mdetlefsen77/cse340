const utilities = require("../utilities/")

async function buildLogin(req, res, next) {
    const nav = await utilities.getNav()
    res.render("account/login", { title: "Login", nav })
}

module.exports = { buildLogin }