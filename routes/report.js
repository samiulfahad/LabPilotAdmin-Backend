const express = require("express");
const router = express.Router();
const { createReport, listReports, deleteReport } = require("../controller/report");

// Route 1: Create a Report
router.post("/add", createReport);

// Route 2: Get all Reports
router.get("/all", listReports);

// Route 3: Delete Report
router.delete("/delete/:id", deleteReport);

module.exports = router;
