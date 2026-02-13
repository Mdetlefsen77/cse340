const utilities = require("../utilities/");
const testdriveModel = require("../models/testdrive-model");
const invModel = require("../models/inventory-model");

const testdriveCont = {};

testdriveCont.buildRequestForm = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const vehicleData = await invModel.getInventoryById(inv_id);

  if (!vehicleData) {
    req.flash("notice", "Vehicle not found.");
    return res.redirect("/");
  }

  const nav = await utilities.getNav();
  res.render("testdrive/request", {
    title: `Request Test Drive - ${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    errors: null,
    vehicleData,
    inv_id,
  });
};

testdriveCont.createRequest = async function (req, res, next) {
  const {
    inv_id,
    preferred_date,
    preferred_time,
    phone_number,
    additional_notes,
  } = req.body;
  const account_id = res.locals.accountData.account_id;

  const result = await testdriveModel.createTestDriveRequest(
    inv_id,
    account_id,
    preferred_date,
    preferred_time,
    phone_number,
    additional_notes,
  );

  if (result) {
    req.flash(
      "success",
      "Your test drive request has been submitted successfully! We will contact you soon.",
    );
    res.redirect("/account/management");
  } else {
    req.flash("notice", "Sorry, the test drive request failed.");
    const vehicleData = await invModel.getInventoryById(inv_id);
    const nav = await utilities.getNav();
    res.status(501).render("testdrive/request", {
      title: `Request Test Drive - ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      errors: null,
      vehicleData,
      inv_id,
      preferred_date,
      preferred_time,
      phone_number,
      additional_notes,
    });
  }
};

testdriveCont.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const requests = await testdriveModel.getAllTestDriveRequests();

  res.render("testdrive/management", {
    title: "Test Drive Requests Management",
    nav,
    errors: null,
    requests,
  });
};

testdriveCont.buildMyRequests = async function (req, res, next) {
  const account_id = res.locals.accountData.account_id;
  const nav = await utilities.getNav();
  const requests =
    await testdriveModel.getTestDriveRequestsByAccountId(account_id);

  res.render("testdrive/my-requests", {
    title: "My Test Drive Requests",
    nav,
    errors: null,
    requests,
  });
};

testdriveCont.updateStatus = async function (req, res, next) {
  const { request_id, status } = req.body;

  const result = await testdriveModel.updateTestDriveStatus(request_id, status);

  if (result) {
    req.flash("success", "Request status updated successfully.");
  } else {
    req.flash("notice", "Sorry, the status update failed.");
  }

  res.redirect("/testdrive/management");
};

module.exports = testdriveCont;
