/** @format */

const { ObjectId } = require("mongodb");
const { getClient } = require("./connection");
const getGMT = require("../helper/getGMT");

const handleError = (e, methodName) => {
  console.log("Error Location: DB File (database > labBilling.js)");
  console.log(`Method Name: ${methodName}`);
  console.log(`Error Message: ${e.message}`);
  return { success: false };
};

class LabBilling {
  // Function 1: Update Billing Info of a lab
  static async update(_id, newData, systemId) {
    try {
      const db = getClient();
      // Create a copy of newData to avoid modifying the original
      const updateData = { ...newData };

      const updateFields = {
        ...updateData,
        billingUpdatedAt: getGMT("date"),
        billingUpdatedBy: systemId,
      };

      const result = await db.collection("labs").updateOne({ _id: new ObjectId(_id) }, { $set: updateFields });

      if (result.modifiedCount > 0) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (e) {
      return handleError(e, "update");
    }
  }
}
module.exports = LabBilling;
