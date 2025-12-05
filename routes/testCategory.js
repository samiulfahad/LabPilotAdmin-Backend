const express = require("express");
const router = express.Router();
const {
  createCategory,
  listCategory,
  updateCategory,
  deleteCategory,
  populateCategoryList,
} = require("../controller/testCategory");

// Route 1: Create a category
router.post("/add", createCategory);

// Route 2: Get all categories
router.get("/all", listCategory);

// Route 3: Populate Categorylist
router.get("/populate", populateCategoryList);

// Route 4: Update a test
router.patch("/edit", updateCategory);

// Route 5: Delete a test
router.delete("/delete", deleteCategory);


module.exports = router;
