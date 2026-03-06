/** @format */
const { ObjectId } = require("mongodb");
const { getClient } = require("./connection");
const handleError = (e, methodName) => {
  console.log("Error Location: DB File (database > report.js)");
  console.log(`Method Name: ${methodName}`);
  console.log(`Error Message: ${e.message}`);
  return { success: false }; // Better return value
};

const collectionName = "reports";

class Report {
  // Function 1: Create Report
  static async create(data) {
    try {
      const db = getClient();

      const result = await db.collection(collectionName).insertOne(data);

      return result.insertedId ? { success: true, test: { _id: result.insertedId } } : { success: false };
    } catch (e) {
      return handleError(e, "create");
    }
  }

  // Function 2: Get Report List
  static async findAll() {
    try {
      const db = getClient();
      const reports = await db.collection(collectionName).find({}).toArray();
      return { success: true, reports };
    } catch (e) {
      return handleError(e, "findAll");
    }
  }

  // Function 3: Delete Report
  static async delete(id) {
    try {
      id = new ObjectId(id);
      const db = getClient();
      const result = await db.collection(collectionName).deleteOne({ _id: id });

      return result.deletedCount > 0 ? { success: true } : { success: false };
    } catch (e) {
      return handleError(e, "delete");
    }
  }
}

module.exports = Report;
