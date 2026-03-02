/** @format */

const Test = require("../database/report");

// Function 1: Create a test
const createReport = async (req, res, next) => {
  try {
    const { data } = req.body;
    const result = await Report.create(data);
    if (result.success) {
      return res.status(201).send({ success: true });
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
const listReports = async (req, res, next) => {
  try {
    const result = await Report.findAll();
    if (result.success) {
      return res.status(201).send(result.reports);
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};


module.exports = {
  // Test endpoints
  createReport,
  listReports
};
