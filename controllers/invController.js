const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

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
  const classificationSelect = await utilities.buildClassificationList();
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
  const classificationList = await utilities.buildClassificationList();
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
    const classificationList =
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

invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData =
    await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

invCont.buildEditInvView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInvId(inv_id);
  const classificationList = await utilities.buildClassificationList(
    itemData.classification_id,
  );
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  console.log(itemName);
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id,
  });
};

invCont.editInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  const {
    inv_id,
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

  const editResult = await invModel.editInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  );

  if (editResult) {
    const itemName = inv_make + " " + inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/management");
  } else {
    req.flash("notice", "Sorry, the edit failed.");
    res.status(501).render("./inventory/edit-inventory", {
      title: "Edit" + inv_make + " " + inv_model,
      nav,
      classificationList,
      inv_id,
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
    });
  }
};

invCont.buildDeleteInvView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInvId(inv_id);
  if (!itemData || itemData.length === 0) {
    req.flash("notice", "Vehicle not found.");
    return res.redirect("/inv/management");
  }
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  });
};

invCont.deleteInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body;

  const deleteResult = await invModel.deleteInventory(parseInt(inv_id));
  console.log(deleteResult);

  if (deleteResult) {
    const itemName = inv_make + " " + inv_model;
    req.flash("notice", `The ${itemName} was successfully deleted.`);
    res.redirect("/inv/management");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).render("./inventory/delete-inventory", {
      title: "Delete" + inv_make + " " + inv_model,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};

module.exports = invCont;
