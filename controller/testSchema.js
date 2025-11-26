/** @format */

const TestSchema = require("../database/testSchema");

// Function 1: Create a test schema
const createTestSchema = async (req, res, next) => {
  try {
    // Get systemId from authenticated user (from middleware)
    const systemId = req.user?.id || req.user?.systemId || 555; // Fallback for development
    const { categoryId, testId, testName, testDescription, fields } = req.body;
    const testSchema = { categoryId, testId, testName, testDescription, fields };

    const result = await TestSchema.addNew(categoryId, testId, testSchema, systemId);

    if (result.success) {
      // console.log(result.lab);
      return res.status(201).send({success:true});
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createTestSchema
};
