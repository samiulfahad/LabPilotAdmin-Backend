const express = require("express");
const router = express.Router();
const {
  createTestSchema,
  listSchema,
  getSchema,
  deleteSchema,
  updateSchema,
  activateSchema,
  deactivateSchema
} = require("../controller/testSchema");
// Add new schema
router.post("/add", createTestSchema);

// Search a schema
router.get("/search", getSchema);

// Get all Schema
router.get("/all", listSchema);

// Delete a schema
router.delete("/delete", deleteSchema);

// Update Schema
router.patch("/update", updateSchema);

// Activate Schema
router.patch("/activate", activateSchema);

// Deactivate Schema
router.patch("/deactivate", deactivateSchema);

module.exports = router;
