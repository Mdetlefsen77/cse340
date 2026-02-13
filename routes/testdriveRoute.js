const express = require("express");
const router = new express.Router();
const testdriveController = require("../controllers/testdriveController");
const utilities = require("../utilities/");
const testdriveValidate = require("../utilities/testdrive-validation");

// Route to display test drive request form (requires login)
router.get(
  "/request/:inv_id",
  utilities.checkLogin,
  utilities.handleErrors(testdriveController.buildRequestForm),
);

// Route to process test drive request (requires login)
router.post(
  "/request",
  utilities.checkLogin,
  testdriveValidate.testDriveRules(),
  testdriveValidate.checkTestDriveData,
  utilities.handleErrors(testdriveController.createRequest),
);

// Route to view user's own test drive requests (requires login)
router.get(
  "/my-requests",
  utilities.checkLogin,
  utilities.handleErrors(testdriveController.buildMyRequests),
);

// Route to manage all test drive requests (requires employee/admin)
router.get(
  "/management",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(testdriveController.buildManagementView),
);

// Route to update test drive request status (requires employee/admin)
router.post(
  "/update-status",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(testdriveController.updateStatus),
);

module.exports = router;
