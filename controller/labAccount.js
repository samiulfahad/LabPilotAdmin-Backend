/** @format */

const Lab = require("../database/labAccount");

// Function 1: Create a new Lab
const createLab = async (req, res, next) => {
  try {
    // Get systemId from authenticated user (from middleware)
    const systemId = req.user?.id || req.user?.systemId || 555; // Fallback for development
    const { name, labId, address, contact1, contact2, email, isActive, zoneId, subZoneId } = req.body;
    const lab = new Lab(
      name,
      parseInt(labId),
      address,
      contact1,
      contact2,
      email,
      isActive,
      zoneId,
      subZoneId,
      systemId
    );
    const result = await lab.save();

    if (result.success) {
      // console.log(result.lab);
      return res.status(201).send(result.lab);
    } else if (result.duplicate) {
      return res.status(400).send({ duplicate: true });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 2: Get a Lab (Search by labId, email, contact, zone, subzone)
const searchLab = async (req, res, next) => {
  try {
    const { field, value } = req.body;
    if (value === "labId") {
      value = parseInt(value);
    }
    console.log(field, value);
    const result = await Lab.find(field, value);
    if (result.success && result.labs) {
      return res.status(200).send(result.labs);
    }
  } catch (e) {
    next(e);
  }
};

// Function 3: Get All Labs
const listLabs = async (req, res, next) => {
  try {
    const { isLabManagement = false } = req.query;
    const result = await Lab.findAll(isLabManagement);
    if (result.success && result.labs) {
      return res.status(200).send(result.labs);
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 4: Update Lab by Lab ID
const updateLab = async (req, res, next) => {
  try {
    // Get systemId from authenticated user
    const systemId = req.user?.id || req.user?.systemId || 777;
    const { _id, name, address, zoneId, subZoneId, contact1, contact2, email, isActive } = req.body;
    const newData = { name, address, zoneId, subZoneId, contact1, contact2, email, isActive };

    const result = await Lab.update(_id, newData, systemId);
    if (result.success) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 5: Deactivate Lab
const deactivateLab = async (req, res, next) => {
  try {
    // Get systemId from authenticated user
    const systemId = req.user?.id || req.user?.systemId || 999;
    const { _id } = req.body;
    const result = await Lab.deactivate(_id, systemId);
    if (result.success) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 7: Deactivate Lab
const activateLab = async (req, res, next) => {
  try {
    // Get systemId from authenticated user
    const systemId = req.user?.id || req.user?.systemId || 999;
    const { _id } = req.body;
    const result = await Lab.activate(_id, systemId);
    if (result.success) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

// Function 8: Delete Lab by Lab ID
const deleteLab = async (req, res, next) => {
  try {
    // Get systemId from authenticated user
    const systemId = req.user?.id || req.user?.systemId || 999;
    const { _id } = req.body;

    const result = await Lab.delete(_id, systemId);
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
  createLab,
  searchLab,
  listLabs,
  updateLab,
  deactivateLab,
  activateLab,
  deleteLab,
};
