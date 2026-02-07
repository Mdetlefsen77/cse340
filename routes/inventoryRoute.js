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
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON),
);
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.inventoryForm),
);

router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteInvView),
);

router.get(
  "/management",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView),
);

router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInvView),
);

router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassification,
  utilities.handleErrors(invController.addClassification),
);

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventory,
  utilities.handleErrors(invController.addInventory),
);

router.post(
  "/edit/",
  invValidate.inventoryRules(),
  invValidate.checkEditData,
  utilities.handleErrors(invController.editInventory),
);

router.post("/delete/", utilities.handleErrors(invController.deleteInventory));
module.exports = router;
