/** @format */

const { ObjectId } = require("mongodb");
const { getClient } = require("./connection");
const getGMT = require("../helper/getGMT");

const handleError = (e, methodName) => {
  console.log("Error Location: DB File (database > testSchema.js)");
  console.log(`Method Name: ${methodName}`);
  console.log(`Error Message: ${e.message}`);
  return { success: false };
};

class TestSchema {
  // Function 1: create a test schema
  static async addNew(schema, systemId) {
    try {
      const db = getClient();
      const newSchema = {
        ...schema,
        createdBy: systemId,
        createdAt: getGMT(),
        isLive: false,
      };
      const result = await db.collection("testSchema").insertOne(newSchema);

      if (result.acknowledged && result.insertedId) {
        return {
          success: true,
          insertedId: result.insertedId,
          message: "Test schema created successfully",
        };
      } else {
        return {
          success: false,
          error: "Failed to create test schema",
        };
      }
    } catch (e) {
      return handleError(e, "addNew");
    }
  }
}
module.exports = TestSchema;
