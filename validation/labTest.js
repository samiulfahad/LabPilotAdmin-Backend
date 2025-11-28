const { body } = require("express-validator");
const { validateMongoId } = require("./mongoId");

// Validate name
const validateName = body("name")
  .notEmpty()
  .withMessage("Test name is required.")
  .isString()
  .trim()
  .escape()
  .toUpperCase()
  .isLength({ max: 70 })
  .withMessage("Test name must not exceed 70 characters.");


// Validate categoryName
const validateCatName = body("categoryName")
  .notEmpty()
  .withMessage("Category name is required.")
  .isString()
  .trim()
  .escape()
  .toUpperCase()
  .isLength({ max: 80 })
  .withMessage("Category name must not exceed 50 characters.");

const validateAddCat = [validateCatName];
const validateEditCat = [validateMongoId("categoryId", "Category ID"), ...validateAddCat];

const validateAddTest = [validateName, validateMongoId("categoryId", "Category ID")];
const validateEditTest = [validateMongoId("testId", "Test ID"), ...validateAddTest];

module.exports = { validateAddTest, validateEditTest, validateAddCat, validateEditCat };
