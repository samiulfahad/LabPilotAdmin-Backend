/** @format */

const Report = require("../database/report");

// Function 1: Create a Report
const createReport = async (req, res, next) => {
  try {
    const { data } = req.body;
    console.log(data);
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

// Function 2: List all Reports
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

// Function 3: Delete a Report
const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await Report.delete(id);
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
  createReport,
  listReports,
  deleteReport,
};
