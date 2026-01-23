const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
    const nav = await utilities.getNav()
    res.render("index", { title: "Home", nav })
}
/* ***************************
 *  Trigger an intentional error
 * ************************** */
baseController.triggerError = async function(req, res, next){
  const error = new Error('Oh no! This is an intentional 500 error for testing purposes.')
  error.status = 500
  throw error
}
module.exports = baseController