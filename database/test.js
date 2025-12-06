/** @format */

const { ObjectId } = require("mongodb");
const { getClient } = require("./connection");

const handleError = (e, methodName) => {
  console.log("Error Location: DB File (database > test.js)");
  console.log(`Method Name: ${methodName}`);
  console.log(`Error Message: ${e.message}`);
  return { success: false }; // Better return value
};

const collectionName = "test";

class Test {
  // Function 1: Create test
  static async create(name, categoryId) {
    try {
      categoryId = new ObjectId(categoryId);
      const db = getClient();

      // Fixed: Check for duplicate name
      const existing = await db.collection(collectionName).findOne({
        name: name,
      });

      if (existing) {
        return { duplicate: true, message: "Test already exists" };
      }

      const result = await db.collection(collectionName).insertOne({
        name,
        categoryId,
        schemaId: null,
      });

      return result.insertedId
        ? { success: true, test: { _id: result.insertedId, name, categoryId } }
        : { success: false };
    } catch (e) {
      return handleError(e, "create");
    }
  }

  // Function 2: Get testList
  static async findAll(categoryId = null) {
    try {
      const db = getClient();
      const query = {};
      if (categoryId) {
        query.categoryId = new ObjectId(categoryId);
      }
      const testList = await db.collection(collectionName).find(query).toArray();
      return { success: true, testList };
    } catch (e) {
      return handleError(e, "findAll");
    }
  }

  // Function 3: Update test - FIXED CRITICAL BUG
  static async update(testId, categoryId, name) {
    try {
      testId = new ObjectId(testId);
      categoryId = new ObjectId(categoryId);
      const db = getClient();

      // FIXED: Exclude current test from duplicate check
      const existing = await db.collection(collectionName).findOne({
        // _id: { $ne: testId }, // This line is critical!
        name: name,
        categoryId: categoryId,
      });

      if (existing) {
        return { duplicate: true, message: "Nothing changed" };
      }

      const result = await db.collection(collectionName).updateOne({ _id: testId }, { $set: { name, categoryId } });

      if (result.matchedCount === 0) {
        return { success: false, error: "Test not found" };
      }

      return result.modifiedCount > 0 ? { success: true } : { success: false };
    } catch (e) {
      return handleError(e, "update");
    }
  }

  // Function 4: Delete Test
  static async delete(testId) {
    try {
      testId = new ObjectId(testId);
      const db = getClient();
      const result = await db.collection(collectionName).deleteOne({ _id: testId });

      return result.deletedCount > 0 ? { success: true } : { success: false };
    } catch (e) {
      return handleError(e, "delete");
    }
  }

  // Function 5: Set Schema to a test
  static async setSchema(testId, schemaId) {
    try {
      testId = new ObjectId(testId);
      schemaId = new ObjectId(schemaId);
      const db = getClient();

      const result = await db.collection(collectionName).updateOne({ _id: testId }, { $set: { schemaId: schemaId } });
      return result.modifiedCount > 0 ? { success: true } : { success: false };
    } catch (e) {
      return handleError(e, "setSchema");
    }
  }

  // Function 6: Unset Schema
  static async unSetSchema(testId) {
    try {
      testId = new ObjectId(testId);
      const db = getClient();
      const result = await db.collection(collectionName).updateOne({ _id: testId }, { $set: { schemaId: null } });
      return result.modifiedCount > 0 ? { success: true } : { success: false };
    } catch (e) {
      return handleError(e, "unSetSchema");
    }
  }
}

module.exports = Test;
