/** @format */

const { getClient } = require("./connection");
const handleError = (e, methodName) => {
  console.log("Error Location: DB File (database > report.js)");
  console.log(`Method Name: ${methodName}`);
  console.log(`Error Message: ${e.message}`);
  return { success: false }; // Better return value
};

const collectionName = "reports";

class Report {
  // Function 1: Create test
  static async create(data) {
    try {
      const db = getClient();

      const result = await db.collection(collectionName).insertOne(data);

      return result.insertedId
        ? { success: true, test: { _id: result.insertedId } }
        : { success: false };
    } catch (e) {
      return handleError(e, "create");
    }
  }

  // Function 2: Get testList
  static async findAll() {
    try {
      const db = getClient();
      const reports = await db.collection(collectionName).find({}).toArray();
      return { success: true, reports };
    } catch (e) {
      return handleError(e, "findAll");
    }
  }
}

module.exports = Report;
