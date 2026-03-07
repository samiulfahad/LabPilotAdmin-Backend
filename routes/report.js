const express = require("express");
const router = express.Router();
const { createReport, listReports, getReport, updateReport, deleteReport } = require("../controller/report");

// Route 1: Create a Report
router.post("/add", createReport);

// Route 2: Get all Reports
router.get("/all", listReports);

// Route 3: Get a single Report by ID
router.get("/:id", getReport);

// Route 4: Update a Report
router.put("/update/:id", updateReport);

// Route 5: Delete a Report
router.delete("/delete/:id", deleteReport);

module.exports = router;
