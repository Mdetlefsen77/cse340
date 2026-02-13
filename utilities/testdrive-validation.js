const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Test Drive Request Validation Rules
 * ********************************* */
validate.testDriveRules = () => {
  return [
    body("inv_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Valid vehicle selection is required."),

    body("preferred_date")
      .trim()
      .notEmpty()
      .isDate()
      .withMessage("Please provide a valid date.")
      .custom((value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          throw new Error("Date must be in the future.");
        }
        return true;
      }),

    body("preferred_time")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Please provide a valid time (HH:MM format)."),

    body("phone_number")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^[\d\s\-\(\)\+]+$/)
      .isLength({ min: 10, max: 20 })
      .withMessage("Please provide a valid phone number (10-20 characters)."),

    body("additional_notes")
      .optional({ checkFalsy: true })
      .trim()
      .escape()
      .isLength({ max: 500 })
      .withMessage("Additional notes must be 500 characters or less."),
  ];
};

/* ******************************
 * Check test drive data and return errors or continue
 * ***************************** */
validate.checkTestDriveData = async (req, res, next) => {
  const {
    inv_id,
    preferred_date,
    preferred_time,
    phone_number,
    additional_notes,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const invModel = require("../models/inventory-model");
    const vehicleData = await invModel.getInventoryById(inv_id);
    res.render("testdrive/request", {
      errors,
      title: `Request Test Drive - ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicleData,
      inv_id,
      preferred_date,
      preferred_time,
      phone_number,
      additional_notes,
    });
    return;
  }
  next();
};

module.exports = validate;
