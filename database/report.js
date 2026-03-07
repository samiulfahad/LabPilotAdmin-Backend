/** @format */
const { ObjectId } = require("mongodb");
const { getClient } = require("./connection");

const handleError = (e, methodName) => {
  console.log("Error Location: DB File (database > report.js)");
  console.log(`Method Name: ${methodName}`);
  console.log(`Error Message: ${e.message}`);
  return { success: false };
};

const collectionName = "reports";

class Report {
  // Function 1: Create Report
  static async create(data) {
    try {
      const db = getClient();
      const result = await db.collection(collectionName).insertOne(data);
      return result.insertedId ? { success: true, report: { _id: result.insertedId } } : { success: false };
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

  // Function 3: Find Report by ID
  static async findById(id) {
    try {
      const db = getClient();
      const report = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
      return report ? { success: true, report } : { success: false, message: "Report not found" };
    } catch (e) {
      return handleError(e, "findById");
    }
  }

  // Function 4: Update Report
  static async update(id, data) {
    try {
      const db = getClient();
      const result = await db
        .collection(collectionName)
        .updateOne({ _id: new ObjectId(id) }, { $set: { ...data, updatedAt: new Date() } });
      return result.matchedCount > 0 ? { success: true } : { success: false, message: "Report not found" };
    } catch (e) {
      return handleError(e, "update");
    }
  }

  // Function 5: Delete Report
  static async delete(id) {
    try {
      const db = getClient();
      const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0 ? { success: true } : { success: false };
    } catch (e) {
      return handleError(e, "delete");
    }
  }
}

module.exports = Report;
