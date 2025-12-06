const express = require("express");
const router = express.Router();
const {
  createTest,
  listTest,
  updateTest,
  deleteTest,
  setTestSchema,
  unsetTestSchema,
} = require("../controller/test");


// Route 1: Create a test
router.post("/add",  createTest);

// Route 2: Get all tests or by categoryId
router.get("/all", listTest);

// Route 3: Update a test
router.patch("/edit",  updateTest);

// Route 4: Delete a test
router.delete("/delete/:testId", deleteTest);

// Route 5: Set Test Schema
router.patch("/setTestSchema", setTestSchema);

// Route 6: Unset Test Schema
router.patch("/unsetTestSchema", unsetTestSchema);

module.exports = router;
