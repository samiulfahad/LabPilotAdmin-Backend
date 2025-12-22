const express = require("express");
const router = express.Router();
const {
  createTestSchema,
  listSchema,
  getSchema,
  deleteSchema,
  updateSchema,
  activateSchema,
  deactivateSchema,
  getSchemaByTestId,
} = require("../controller/testSchema");

// Add new schema
router.post("/add", createTestSchema);

// Search a schema by schemaId
router.get("/search/:schemaId", getSchema);

// Get all Schema
router.get("/all", listSchema);

// Get schema by testId
router.get("/:testId", getSchemaByTestId);

// Delete a schema
router.delete("/delete/:schemaId", deleteSchema);

// Update Schema
router.put("/update", updateSchema);

// Activate Schema
router.patch("/activate/:schemaId", activateSchema);

// Deactivate Schema
router.patch("/deactivate/:schemaId", deactivateSchema);

module.exports = router;
