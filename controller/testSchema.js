/** @format */

const TestSchema = require("../database/testSchema");

// Function 1: Create a test schema
const createTestSchema = async (req, res, next) => {
  try {
    const { name, description, testId, isActive, sections, hasStaticStandardRange, staticStandardRange } = req.body;
    const testSchema = { name, description, testId, isActive, sections, hasStaticStandardRange, staticStandardRange };
    // console.log(testSchema);
    const result = await TestSchema.addNew(testSchema);
    if (result.success) {
      // console.log(result.lab);
      return res.status(201).send({ success: true, schemaId: result.schemaId });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 2: Find Schema by ID
const getSchema = async (req, res, next) => {
  try {
    const { schemaId } = req.params;
    // console.log(schemaId);
    const result = await TestSchema.find(schemaId);
    if (result.success) {
      return res.status(200).send(result.schema);
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 3: List All Schema
const listSchema = async (req, res, next) => {
  try {
    const result = await TestSchema.findAll();
    if (result.success) {
      return res.status(201).send(result.list);
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 4: Delete Schema
const deleteSchema = async (req, res, next) => {
  try {
    const { schemaId } = req.params;
    const result = await TestSchema.delete(schemaId);
    if (result.success) {
      return res.status(201).send({ success: true });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 5: Update Schema
const updateSchema = async (req, res, next) => {
  try {
    const { schemaId, name, description, testId, isActive, sections, hasStaticStandardRange, staticStandardRange } =
      req.body;
    const data = { name, description, testId, isActive, sections, hasStaticStandardRange, staticStandardRange };
    // console.log(data);
    const result = await TestSchema.update(schemaId, data);
    if (result.success) {
      return res.status(200).send({
        success: true,
        message: result.message,
        schema: result.updatedSchema,
      });
    } else {
      return res.status(400).send({
        success: false,
        error: result.error,
      });
    }
  } catch (e) {
    next(e);
  }
};

// Function 6: Activate Schema
const activateSchema = async (req, res, next) => {
  try {
    const { schemaId } = req.params;
    const result = await TestSchema.activate(schemaId);

    if (result.success) {
      return res.status(200).send({ success: true, message: result.message });
    } else {
      return res.status(400).send({ success: false, message: result.message });
    }
  } catch (e) {
    next(e);
  }
};

// Function 7: Deactivate Schema
const deactivateSchema = async (req, res, next) => {
  try {
    const { schemaId } = req.params;
    const result = await TestSchema.deactivate(schemaId);
    if (result.success) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 8: Get Schema by Test ID
const getSchemaByTestId = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const { isActive } = req.query;
    const result = await TestSchema.findByTestId(testId, isActive);
    if (result.success) {
      // console.log(result.list);
      return res.status(200).send(result.list);
    } else {
      return res.status(404).send({
        success: false,
        message: result.error || "Schema not found for this test",
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createTestSchema,
  getSchema,
  listSchema,
  deleteSchema,
  updateSchema,
  activateSchema,
  deactivateSchema,
  getSchemaByTestId,
};
