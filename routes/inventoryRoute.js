const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId),
);
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId),
);
router.get("/", utilities.handleErrors(invController.buildManagementView));

router.get(
  "/add-classification",
  utilities.handleErrors(invController.classificationForm),
);

router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassification,
  utilities.handleErrors(invController.addClassification),
);

router.get(
  "/add-inventory",
  utilities.handleErrors(invController.inventoryForm),
);

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventory,
  utilities.handleErrors(invController.addInventory),
);
router.get(
  "/management",
  utilities.handleErrors(invController.buildManagementView),
);
module.exports = router;
