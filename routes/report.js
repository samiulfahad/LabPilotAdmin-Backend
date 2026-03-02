const express = require("express");
const router = express.Router();
const {
  createReport,
  listReports,
} = require("../controller/report");


// Route 1: Create a test
router.post("/add",  createReport);

// Route 2: Get all tests or by categoryId
router.get("/all", listReports);


module.exports = router;
