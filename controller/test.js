/** @format */

const Test = require("../database/test");

// Function 1: Create a test
const createTest = async (req, res, next) => {
  try {
    const { name, categoryId } = req.body;
    const result = await Test.create(name, categoryId);
    if (result.success) {
      return res.status(201).send({ success: true, test: result.test });
    } else if (result.duplicate) {
      return res.status(400).send({ duplicate: true, message: result.message });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 2: List all Tests
const listTest = async (req, res, next) => {
  try {
    const result = await Test.findAll();
    if (result.success) {
      return res.status(201).send(result.testList);
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 3: Update a test
const updateTest = async (req, res, next) => {
  try {
    const { testId, categoryId, name } = req.body;
    const result = await Test.update(testId, categoryId, name);
    // console.log(testId);
    // console.log(categoryId);
    // console.log(name);
    if (result.success) {
      return res.status(200).send({ success: true });
    } else if (result.duplicate) {
      return res.status(400).send({ duplicate: true, message: result.message });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 4: Delete a test
const deleteTest = async (req, res, next) => {
  try {
    const { testId } = req.params;
    // console.log(testId);
    const result = await Test.delete(testId);
    if (result.success) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 5: Set schema to test
const setTestSchema = async (req, res, next) => {
  try {
    const { testId, schemaId } = req.body;
    const result = await Test.setSchema(testId, schemaId);
    if (result.success) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 6: Unset schema from test
const unsetTestSchema = async (req, res, next) => {
  try {
    const { testId } = req.body;
    const result = await Test.unSetSchema(testId);
    if (result.success) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  // Test endpoints
  createTest,
  listTest,
  updateTest,
  deleteTest,

  setTestSchema,
  unsetTestSchema,
};
