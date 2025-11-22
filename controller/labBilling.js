const LabBilling = require("../database/labBilling");

// Route 1: Update Billing
const updateBilling = async (req, res, next) => {
  try {
    const { _id, invoicePrice, labCommission, monthlyFee } = req.body;
    const billingData = {
      invoicePrice: parseFloat(invoicePrice),
      labCommission: parseFloat(labCommission),
      monthlyFee: parseFloat(monthlyFee),
    };
    if (billingData.labCommission > billingData.invoicePrice) {
      return res.status(400).send({ success: false });
    }
    const systemId = 555;

    // Fixed: Pass _id as first parameter, then billingData, then systemId
    const result = await LabBilling.update(_id, billingData, systemId);

    if (result.success) {
      return res.status(201).send({ success: true });
    } else {
      return res.status(400).send({ success: false });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  updateBilling,
};
