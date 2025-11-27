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
  static async addNew(categoryId, testId, schema, systemId) {
    try {
      const db = getClient();
      const newSchema = {
        categoryId,
        testId,
        ...schema,
        createdBy: systemId,
        createdAt: getGMT(),
      };
      const result = await db.collection("testSchema").insertOne(newSchema);

      if (result.acknowledged && result.insertedId) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (e) {
      return handleError(e, "addNew");
    }
  }

  // Function 2: Search schemas
  static async find(schemaId) {
    try {
      const db = getClient();
      const schema = await db.collection("testSchema").findOne({ _id: new ObjectId(schemaId) });
      // console.log(schema);
      if (schema) {
        return {
          success: true,
          schema,
        };
      } else {
        return {
          success: false,
          error: "Failed to fetch test schema",
        };
      }
    } catch (e) {
      return handleError(e, "find");
    }
  }

  // Function 3: Get all schemas
  static async findAll() {
    try {
      const db = getClient();
      const list = await db.collection("testSchema").find({}).toArray();
      console.log(list);
      if (list) {
        return {
          success: true,
          list,
        };
      } else {
        return {
          success: false,
          error: "Failed to fetch all test schemas",
        };
      }
    } catch (e) {
      return handleError(e, "findAll");
    }
  }

  // Function 4: Delete a schema
  static async delete(schemaId) {
    try {
      const db = getClient();
      const result = await db.collection("testSchema").deleteOne({ _id: new ObjectId(schemaId) });

      if (result.deletedCount === 1) {
        return {
          success: true,
          message: "Schema deleted successfully",
        };
      } else {
        return {
          success: false,
          error: "Schema not found or already deleted",
        };
      }
    } catch (e) {
      return handleError(e, "delete");
    }
  }

  // Function 5: Update a schema
  static async update(schemaId, updateData, systemId) {
    try {
      const db = getClient();

      // Prepare update object
      const updateFields = {
        ...updateData,
        updatedBy: systemId,
        updatedAt: getGMT(),
      };

      const result = await db.collection("testSchema").findOneAndUpdate(
        { _id: new ObjectId(schemaId) },
        { $set: updateFields },
        { returnDocument: "after" } // Returns the updated document
      );

      if (result.value) {
        return {
          success: true,
          updatedSchema: result.value,
          message: "Schema updated successfully",
        };
      } else {
        return {
          success: false,
          error: "Schema not found or update failed",
        };
      }
    } catch (e) {
      return handleError(e, "update");
    }
  }

  // Function 6: Activate schema
  static async activate(schemaId, systemId) {
    try {
      const db = getClient();

      // First update the document
      const updateResult = await db.collection("testSchema").updateOne(
        { _id: new ObjectId(schemaId) },
        {
          $set: {
            isLive: true,
            activatedBy: systemId,
            activatedAt: getGMT(),
          },
          $unset: {
            deactivatedAt: "",
            deactivatedBy: "",
          },
        }
      );

      // Check if document was updated
      if (updateResult.modifiedCount === 1 || updateResult.matchedCount === 1) {
        return { success: true };
      }
      return { success: false };
    } catch (e) {
      return handleError(e, "activate");
    }
  }

  // Function 7: Deactivate schema
  static async deactivate(schemaId, systemId) {
    try {
      const db = getClient();

      // First update the document
      const updateResult = await db.collection("testSchema").updateOne(
        { _id: new ObjectId(schemaId) },
        {
          $set: {
            isLive: false,
            deactivatedBy: systemId,
            deactivatedAt: getGMT(),
          },
          $unset: {
            activatedAt: "",
            activatedBy: "",
          },
        }
      );

      // Check if document was updated
      if (updateResult.modifiedCount === 1 || updateResult.matchedCount === 1) {
        return { success: true };
      }
      return { success: false };
    } catch (e) {
      return handleError(e, "deactivate");
    }
  }
}

module.exports = TestSchema;
