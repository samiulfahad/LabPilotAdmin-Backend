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
  static async update(schemaId, updateData, systemId) {
    try {
      const db = getClient();

      // Prepare update object
      const updateFields = {
        ...updateData,
        updatedBy: systemId,
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
  static async activate(schemaId, systemId) {
    try {
      const db = getClient();

      // First update the document
      const updateResult = await db.collection("testSchema").updateOne(
        { _id: new ObjectId(schemaId) },
        {
          $set: {
            isActive: true,
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
            isActive: false,
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

  // Function 8: Find schema by testId
  static async findByTestId(testId) {
    try {
      const db = getClient();
      const list = await db.collection("testSchema").find({ testId }).toArray();
      // console.log(list);
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

  // Function 9: Find schemas by categoryId
  static async findByCategoryId(categoryId) {
    try {
      const db = getClient();
      const list = await db.collection("testSchema").find({ categoryId }).toArray();
      console.log(list);
      if (list) {
        return { success: true, list };
      } else {
        return { success: false };
      }
    } catch (e) {
      return handleError(e, "findByCategoryId");
    }
  }
  // Function 10: Get all schemas with populated category and test names
  static async findAllPopulated() {
    try {
      const db = getClient();

      // Using aggregation to join with categories collection
      const list = await db
        .collection("testSchema")
        .aggregate([
          {
            $lookup: {
              from: "categories", // your categories collection name
              localField: "categoryId",
              foreignField: "_id",
              as: "categoryInfo",
            },
          },
          {
            $unwind: {
              path: "$categoryInfo",
              preserveNullAndEmptyArrays: true, // in case category is deleted
            },
          },
          {
            $addFields: {
              categoryName: "$categoryInfo.categoryName",
              // Find the specific test within the category's tests array
              testInfo: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$categoryInfo.tests",
                      as: "test",
                      cond: { $eq: ["$$test._id", "$testId"] },
                    },
                  },
                  0,
                ],
              },
            },
          },
          {
            $addFields: {
              nameFromCollection: "$testInfo.name",
            },
          },
          {
            $project: {
              categoryInfo: 0,
              testInfo: 0,
            },
          },
        ])
        .toArray();

      if (list) {
        return { success: true, list };
      } else {
        return { success: false };
      }
    } catch (e) {
      return handleError(e, "findAllPopulated");
    }
  }
}

module.exports = TestSchema;
