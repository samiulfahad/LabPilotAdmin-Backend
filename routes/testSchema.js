const express = require("express");
const router = express.Router();
const { createTestSchema } = require("../controller/testSchema");
// Edit Billing
router.post("/add", createTestSchema);

module.exports = router;
