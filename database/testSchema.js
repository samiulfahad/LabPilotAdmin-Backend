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
  static async addNew(schema) {
    try {
      const db = getClient();
      const newSchema = {
        ...schema,
        createdAt: getGMT(),
      };
      const result = await db.collection("testSchema").insertOne(newSchema);

      if (result.acknowledged && result.insertedId) {
        return { success: true, schemaId: result.insertedId };
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
      // console.log(list);
      if (list) {
        return { success: true, list };
      } else {
        return { success: false };
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

  // Function 5: Update a schema - Simple and reliable
  static async update(schemaId, updateData) {
    try {
      const db = getClient();

      // Prepare update object
      const updateFields = {
        ...updateData,
        updatedAt: getGMT(),
      };

      // Update the document
      const updateResult = await db
        .collection("testSchema")
        .updateOne({ _id: new ObjectId(schemaId) }, { $set: updateFields });

      console.log("Update result:", updateResult);

      // Check if document was found and updated
      if (updateResult.matchedCount === 0) {
        return {
          success: false,
          error: "Schema not found",
        };
      }

      if (updateResult.modifiedCount === 0) {
        return {
          success: false,
          error: "No changes made to the schema",
        };
      }

      // Fetch the updated document
      const updatedSchema = await db.collection("testSchema").findOne({
        _id: new ObjectId(schemaId),
      });

      return {
        success: true,
        updatedSchema: updatedSchema,
        message: "Schema updated successfully",
      };
    } catch (e) {
      return handleError(e, "update");
    }
  }

  // Function 6: Activate schema
  static async activate(schemaId) {
    try {
      const db = getClient();

      // First update the document
      const updateResult = await db.collection("testSchema").updateOne(
        { _id: new ObjectId(schemaId) },
        {
          $set: {
            isActive: true,
            activatedAt: getGMT(),
          },
          $unset: {
            deactivatedAt: ""
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
  static async deactivate(schemaId) {
    try {
      const db = getClient();

      // First update the document
      const updateResult = await db.collection("testSchema").updateOne(
        { _id: new ObjectId(schemaId) },
        {
          $set: {
            isActive: false,
            deactivatedAt: getGMT(),
          },
          $unset: {
            activatedAt: "",
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

  // Function 8: Find schema by testId
  static async findByTestId(testId) {
    try {
      const db = getClient();
      const list = await db.collection("testSchema").find({ testId }).toArray();
      console.log(list);
      if (list) {
        return {
          success: true,
          list,
        };
      } else {
        return {
          success: false,
          error: "No schema found for this test",
        };
      }
    } catch (e) {
      return handleError(e, "findByTestId");
    }
  }
}

module.exports = TestSchema;
