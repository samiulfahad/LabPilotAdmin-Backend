const express = require("express");
const router = express.Router();
const { updateBilling } = require("../controller/labBilling");
// Edit Billing
router.patch("/update", updateBilling);



module.exports = router;
