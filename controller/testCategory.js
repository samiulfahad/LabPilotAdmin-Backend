const TestCategory = require("../database/testCategory");

// Function 1: Create category
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const result = await TestCategory.create(name);
    if (result.success) {
      return res.status(201).send({ _id: result.categoryId });
    } else if (result.duplicate) {
      return res.status(400).send({ duplicate: true });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 2: Get all categories
const listCategory = async (req, res, next) => {
  try {
    const result = await TestCategory.findAll();
    if (result.success) {
      return res.status(200).send(result.categoryList);
    } else {
      return res.status(200).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 3: Update category
const updateCategory = async (req, res, next) => {
  try {
    const { categoryId, name } = req.body;
    const result = await TestCategory.update(categoryId, name);
    if (result.success) {
      return res.status(200).send({ success: true });
    } else if (result.duplicate) {
      return res.status(400).send({ duplicate: true });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 4: Delete Category
const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.body;
    const result = await TestCategory.delete(categoryId);
    if (result.success) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 5: Get all tests by category
const populateCategoryList = async (req, res, next) => {
  try {
    const result = await TestCategory.populateCategoryList();
    if (result?.success) {
      return res.status(200).send(result.populatedList);
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createCategory,
  listCategory,
  updateCategory,
  deleteCategory,
  populateCategoryList,
};
