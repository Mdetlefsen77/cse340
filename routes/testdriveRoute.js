const express = require("express");
const router = new express.Router();
const testdriveController = require("../controllers/testdriveController");
const utilities = require("../utilities/");
const testdriveValidate = require("../utilities/testdrive-validation");

router.get(
  "/request/:inv_id",
  utilities.checkLogin,
  utilities.handleErrors(testdriveController.buildRequestForm),
);

router.post(
  "/request",
  utilities.checkLogin,
  testdriveValidate.testDriveRules(),
  testdriveValidate.checkTestDriveData,
  utilities.handleErrors(testdriveController.createRequest),
);

router.get(
  "/my-requests",
  utilities.checkLogin,
  utilities.handleErrors(testdriveController.buildMyRequests),
);

router.get(
  "/management",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(testdriveController.buildManagementView),
);

router.post(
  "/update-status",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(testdriveController.updateStatus),
);

module.exports = router;
