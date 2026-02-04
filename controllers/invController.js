const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* *******************************
 *  Build inventory by classification view
 * ******************************* */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  if (!data || data.length === 0) {
    const err = new Error("No vehicles found for that classification.");
    err.status = 404;
    throw err;
  }
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildByInventoryId = async function (req, res, next) {
  const invId = req.params.invId;
  const data = await invModel.getInventoryById(invId);

  if (!data) {
    const err = new Error("Vehicle not found.");
    err.status = 404;
    throw err;
  }

  const detail = await utilities.buildVehicleDetail(data);
  let nav = await utilities.getNav();

  res.render("./inventory/details", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    detail,
  });
};

invCont.buildManagementView = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
  });
};

invCont.classificationForm = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;

  const classificationResult =
    await invModel.addClassification(classification_name);

  if (classificationResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`,
    );
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, adding a classification failed.");
    let nav = await utilities.getNav();
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

invCont.inventoryForm = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    classificationList: classificationList,
    errors: null,
  });
};

invCont.addInventory = async function (req, res) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const inventoryResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  );

  if (inventoryResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, adding a new inventory item failed.");
    let nav = await utilities.getNav();
    let classificationList =
      await utilities.buildClassificationList(classification_id);
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      errors: null,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
  }
};

module.exports = invCont;
